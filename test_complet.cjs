/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  TEST COMPLET — tous les endpoints NEKASO, par rôle.              ║
  ╚══════════════════════════════════════════════════════════════════╝

  Lecture seule par défaut (aucune donnée modifiée, sauf les 2 créations
  locataire qui sont dédupliquées côté backend).
  Pour tester AUSSI les écritures (création bien, changements de statut,
  workflow pré-contrat → contrat → paiement) : lancer avec WRITE=1.

  Identifiants : modifie le bloc CONFIG ci-dessous, ou passe-les en variables
  d'environnement.

  Exemples :
    node test_complet.cjs
    GEST_TEL=771234567 GEST_PWD=monMotDePasse node test_complet.cjs
    WRITE=1 GEST_TEL=771234567 GEST_PWD=monMotDePasse node test_complet.cjs
*/
const axios = require('axios');

/* ─────────────── CONFIG ─────────────── */
const BASE = process.env.NEKASO_BASE || 'http://74.248.184.17:8080';
const WRITE = process.env.WRITE === '1';
const GEST = { telephone: process.env.GEST_TEL || '777585638', motDePasse: process.env.GEST_PWD || '123456' };
const LOC  = { telephone: process.env.LOC_TEL || '770000999', motDePasse: process.env.LOC_PWD || 'Test@1234', prenom: 'Test', nom: 'Locataire' };
/* ─────────────────────────────────────── */

let pass = 0, warn = 0, fail = 0;
const pick = (d) => d?.token || d?.message?.token || d?.data?.token;
const H = (t) => (t ? { headers: { Authorization: `Bearer ${t}` } } : {});
const short = (x) => (typeof x === 'object' ? JSON.stringify(x) : String(x ?? '')).slice(0, 110);
const nb = (data) => {
  const l = Array.isArray(data) ? data : (data?.data || data?.content || []);
  return Array.isArray(l) ? `${l.length} élt(s)` : typeof data;
};

function log(status, label, extra = '') {
  let tag;
  if (status === 'OK') { tag = '✅ OK '; pass++; }
  else if (status === 403) { tag = '🔒 403'; warn++; }
  else if (status === 404) { tag = '⚪ 404'; warn++; }
  else if (status === 409) { tag = '🟡 409'; warn++; }
  else { tag = `❌ ${status}`; fail++; }
  console.log(`   ${tag}  ${label}${extra ? '  → ' + extra : ''}`);
}

async function call(method, url, { token, body } = {}) {
  try {
    let res;
    if (method === 'GET') res = await axios.get(BASE + url, H(token));
    else if (method === 'POST') res = await axios.post(BASE + url, body || {}, H(token));
    else if (method === 'PATCH') res = await axios.patch(BASE + url, body || {}, H(token));
    return { ok: true, status: res.status, data: res.data };
  } catch (e) {
    return { ok: false, status: e.response?.status || 'NET', data: e.response?.data };
  }
}

// GET avec affichage du nombre d'éléments.
async function get(token, url, label) {
  const r = await call('GET', url, { token });
  log(r.ok ? 'OK' : r.status, label, r.ok ? nb(r.data) : short(r.data?.message || r.data));
  return r;
}

async function login(creds, label) {
  for (const path of ['/api/v1/auth/login', '/api/auth/login']) {
    const r = await call('POST', path, { body: { telephone: creds.telephone, motDePasse: creds.motDePasse } });
    if (r.ok && pick(r.data)) { console.log(`   ✅ login ${label}`); return pick(r.data); }
  }
  console.log(`   ❌ login ${label} ÉCHOUÉ (${creds.telephone})`);
  return null;
}

function titre(t) { console.log(`\n━━━ ${t} ━━━`); }

(async () => {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   TEST COMPLET NEKASO                           ║');
  console.log(`║   BASE  = ${BASE.padEnd(36)}║`);
  console.log(`║   MODE  = ${(WRITE ? 'LECTURE + ÉCRITURE' : 'LECTURE SEULE').padEnd(36)}║`);
  console.log('╚════════════════════════════════════════════════╝');

  /* ── AUTH ── */
  titre('AUTH');
  try { await axios.post(`${BASE}/api/v1/auth/register`, LOC); console.log('   ✅ register locataire (ou déjà existant)'); }
  catch { console.log('   ⚪ register locataire (déjà existant)'); }
  const L = await login(LOC, 'LOCATAIRE');
  const G = await login(GEST, 'GESTIONNAIRE');
  if (!G) console.log('   ⚠️  Sans token gestionnaire, les tests gestionnaire afficheront 403.');

  // Un bien disponible (id) pour les créations locataire.
  let bienId = null;
  const dispo = await call('GET', '/api/biens/locataire/biens_disponibles?page=0&size=1', { token: L });
  if (dispo.ok) bienId = (dispo.data?.data || dispo.data?.content || dispo.data || [])[0]?.id;

  /* ── BIENS ── */
  titre('BIENS');
  await get(G, '/api/biens/gestionnaire?page=0&size=5', 'GET  gestionnaire (liste globale)');
  await get(G, '/api/biens/gestionnaire/mes-biens?page=0&size=5', 'GET  gestionnaire/mes-biens');
  await get(L, '/api/biens/locataire/biens_disponibles?page=0&size=5', 'GET  locataire/biens_disponibles');

  /* ── VISITES ── */
  titre('VISITES');
  await get(G, '/api/visites/gestionnaire/demande?page=0&size=5', 'GET  gestionnaire/demande');
  await get(L, '/api/visites/locataire/mes_demandes?page=0&size=5', 'GET  locataire/mes_demandes');
  if (bienId) {
    const r = await call('POST', `/api/visites/locataire/bien/${bienId}`, { token: L });
    log(r.ok ? 'OK' : r.status, `POST locataire/bien/${bienId} (créer visite)`, short(r.data?.message || r.data));
  }

  /* ── DEMANDES DE LOCATION ── */
  titre('DEMANDES DE LOCATION');
  await get(G, '/api/demandes/gestionnaire/demandes-locations?page=0&size=5', 'GET  gestionnaire/demandes-locations');
  await get(L, '/api/demandes/locataire?page=0&size=5', 'GET  locataire');
  if (bienId) {
    const r = await call('POST', `/api/demandes/locataire/bien/${bienId}`, { token: L });
    log(r.ok ? 'OK' : r.status, `POST locataire/bien/${bienId} (créer demande)`, short(r.data?.message || r.data));
  }

  /* ── PRÉ-CONTRATS ── */
  titre('PRÉ-CONTRATS');
  await get(G, '/api/pre-contrats/gestionnaire?page=0&size=5', 'GET  gestionnaire');
  await get(L, '/api/pre-contrats/locataire?page=0&size=5', 'GET  locataire');

  /* ── CONTRATS ── */
  titre('CONTRATS');
  await get(G, '/api/contrats/gestionnaire/mes-contrats?page=0&size=5', 'GET  gestionnaire/mes-contrats');
  await get(L, '/api/contrats/locataire/mes-contrats?page=0&size=5', 'GET  locataire/mes-contrats');

  /* ── PAIEMENTS ── (nécessite un id de contrat RÉEL) */
  titre('PAIEMENTS');
  const cG = G ? (await call('GET', '/api/contrats/gestionnaire/mes-contrats?page=0&size=1', { token: G })).data : null;
  const cL = (await call('GET', '/api/contrats/locataire/mes-contrats?page=0&size=1', { token: L })).data;
  const contratId = (cG?.data || cG?.content || [])[0]?.id || (cL?.data || cL?.content || [])[0]?.id || null;
  if (contratId) {
    await get(G, `/api/paiements/gestionnaire/historiques-paiements/contrat/${contratId}`, `GET  gestionnaire/historiques/contrat/${contratId}`);
    await get(L, `/api/paiements/locataire/historiques-paiements/contrat/${contratId}`, `GET  locataire/historiques/contrat/${contratId}`);
  } else {
    console.log('   ⚪ Aucun contrat disponible — test paiements ignoré (il faut d\'abord un contrat actif).');
  }

  /* ── ÉCRITURES (workflow gestionnaire) ── */
  if (WRITE && G) {
    titre('ÉCRITURES (WRITE=1)');
    // Valider la 1re demande de visite en attente, puis la 1re demande de location.
    const visites = (await call('GET', '/api/visites/gestionnaire/demande?statut=EN_ATTENTE&page=0&size=1', { token: G })).data;
    const v = (visites?.data || visites?.content || [])[0];
    if (v?.id) {
      const r = await call('PATCH', `/api/visites/gestionnaire/demande/${v.id}/statut/REFUSEE`, { token: G });
      log(r.ok ? 'OK' : r.status, `PATCH visite ${v.id} statut/REFUSEE`, short(r.data?.message || r.data));
    } else log(404, 'PATCH visite (aucune EN_ATTENTE à cibler)');

    const dems = (await call('GET', '/api/demandes/gestionnaire/demandes-locations?statut=EN_ATTENTE&page=0&size=1', { token: G })).data;
    const d = (dems?.data || dems?.content || [])[0];
    if (d?.id) {
      const r = await call('PATCH', `/api/demandes/gestionnaire/demande/${d.id}/statut/VALIDEE`, { token: G });
      log(r.ok ? 'OK' : r.status, `PATCH demande ${d.id} statut/VALIDEE`, short(r.data?.message || r.data));
    } else log(404, 'PATCH demande (aucune EN_ATTENTE à cibler)');
  } else if (WRITE && !G) {
    console.log('\n   ⚠️  WRITE=1 mais pas de token gestionnaire — écritures ignorées.');
  }

  /* ── BILAN ── */
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log(`║   BILAN : ✅ ${String(pass).padEnd(3)} | 🔒/⚪/🟡 ${String(warn).padEnd(3)} | ❌ ${String(fail).padEnd(3)}             ║`);
  console.log('╚════════════════════════════════════════════════╝');
  console.log('  ✅ = OK   🔒403 = bon endpoint, mauvais rôle/token   ⚪404 = vide   🟡409 = déjà existant   ❌ = à corriger');
})().catch((e) => console.error('Erreur fatale:', e.message));
