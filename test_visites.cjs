/*
  Test ciblé du demande-visite-controller (nomenclature officielle Swagger).
  Endpoints couverts :
    POST  /api/visites/locataire/bien/{id_Bien}
    GET   /api/visites/locataire/mes_demandes            (statut?, page, size)
    GET   /api/visites/gestionnaire/demande              (statut?, page, size)
    PATCH /api/visites/gestionnaire/demande/{id}/statut/{statut}
    PATCH /api/visites/gestionnaire/demande/{id}/confirmer/bien/{idBien}/agent/{idAgent}

  Usage :  node test_visites.cjs
*/
const axios = require('axios');
const BASE = process.env.NEKASO_BASE || 'http://74.248.184.17:8080';

// Identifiants de test (modifiables via variables d'environnement).
const GEST = { telephone: process.env.GEST_TEL || '777585638', motDePasse: process.env.GEST_PWD || '123456' };
const LOC  = { telephone: '770000999', motDePasse: 'Test@1234', prenom: 'TestPrenom', nom: 'TestNom' };

const pick = (d) => d?.token || d?.message?.token || d?.data?.token || d?.accessToken;

async function login(creds, label) {
  for (const path of ['/api/v1/auth/login', '/api/auth/login']) {
    try {
      const res = await axios.post(`${BASE}${path}`, { telephone: creds.telephone, motDePasse: creds.motDePasse });
      const token = pick(res.data);
      if (token) { console.log(`  OK   login ${label} (${path})`); return token; }
      console.log(`  WARN login ${label} (${path}) 200 mais pas de token: ${JSON.stringify(res.data).slice(0,120)}`);
    } catch (e) {
      // essaie le path suivant
    }
  }
  console.log(`  FAIL login ${label}`);
  return null;
}

async function ensureLocataire() {
  try { await axios.post(`${BASE}/api/v1/auth/register`, LOC); } catch (e) { /* existe déjà */ }
  return login(LOC, 'LOCATAIRE');
}

function H(t) { return { headers: { Authorization: `Bearer ${t}` } }; }

// Vérifie que les champs attendus par mapVisite() sont présents.
function auditVisite(v) {
  if (!v) { console.log('     (liste vide — rien à auditer)'); return; }
  const has = (k) => Object.prototype.hasOwnProperty.call(v, k);
  console.log('     champs visite  :', Object.keys(v).join(', '));
  console.log('     id             :', has('id') ? 'OK' : 'MANQUANT');
  console.log('     statut         :', has('statut') ? 'OK' : 'MANQUANT');
  console.log('     dateCreation   :', has('dateCreation') ? 'OK' : 'MANQUANT');
  console.log('     id_Locataire   :', has('id_Locataire') ? 'OK' : (has('locataireId') ? 'via locataireId' : 'MANQUANT'));
  if (v.bien) {
    console.log('     bien.id        :', v.bien.id != null ? 'OK' : 'MANQUANT');
    console.log('     bien.libelle   :', v.bien.libelle != null ? `OK ("${v.bien.libelle}")` : 'MANQUANT (→ intitule sera vide)');
    console.log('     bien.photos    :', Array.isArray(v.bien.photos) ? `${v.bien.photos.length} photo(s)` : 'MANQUANT');
  } else {
    console.log('     bien           : ABSENT du payload');
  }
}

async function get(token, url, label) {
  try {
    const res = await axios.get(`${BASE}${url}`, H(token));
    const body = res.data;
    const liste = Array.isArray(body) ? body : (body?.data || body?.content || []);
    console.log(`  OK   ${label} -> ${res.status} | enveloppe: ${Array.isArray(body) ? 'tableau brut' : Object.keys(body).join(',')}`);
    console.log(`     nb éléments    : ${liste.length}`);
    auditVisite(liste[0]);
    return liste;
  } catch (e) {
    console.log(`  ${e.response?.status === 404 ? 'VIDE' : 'ERR '} ${label} -> ${e.response?.status}: ${JSON.stringify(e.response?.data)?.slice(0,140)}`);
    return [];
  }
}

(async () => {
  console.log('========================================');
  console.log('  TEST demande-visite-controller');
  console.log(`  BASE = ${BASE}`);
  console.log('========================================\n');

  console.log('--- Authentification ---');
  const gToken = await login(GEST, 'GESTIONNAIRE');
  const lToken = await ensureLocataire();

  console.log('\n--- 1) GET /api/visites/gestionnaire/demande ---');
  if (gToken) await get(gToken, '/api/visites/gestionnaire/demande?page=0&size=5', 'gestionnaire/demande');
  else console.log('  (pas de token gestionnaire — vérifie GEST_TEL/GEST_PWD)');

  console.log('\n--- 2) GET /api/visites/locataire/mes_demandes ---');
  let mes = [];
  if (lToken) mes = await get(lToken, '/api/visites/locataire/mes_demandes?page=0&size=5', 'locataire/mes_demandes');

  console.log('\n--- 3) POST /api/visites/locataire/bien/{id_Bien} ---');
  if (lToken) {
    // Récupère un bien disponible pour avoir un id valide.
    let bienId = null;
    try {
      const dispo = await axios.get(`${BASE}/api/biens/locataire/biens_disponibles?page=0&size=1`, H(lToken));
      const liste = dispo.data?.data || dispo.data?.content || dispo.data || [];
      bienId = liste[0]?.id;
      console.log(`     bien disponible ciblé : #${bienId}`);
    } catch (e) {
      console.log('     impossible de lister les biens disponibles:', e.response?.status);
    }
    if (bienId) {
      try {
        const res = await axios.post(`${BASE}/api/visites/locataire/bien/${bienId}`, {}, H(lToken));
        console.log(`  OK   POST bien/${bienId} -> ${res.status} | réponse:`, JSON.stringify(res.data).slice(0, 200));
      } catch (e) {
        console.log(`  ERR  POST bien/${bienId} -> ${e.response?.status}: ${JSON.stringify(e.response?.data)?.slice(0,160)}`);
      }
      // Confirme l'apparition de la demande
      mes = await get(lToken, '/api/visites/locataire/mes_demandes?page=0&size=5', 'mes_demandes (après POST)');
    }
  }

  console.log('\n--- 4) PATCH .../demande/{id}/statut/{statut} (dry: REFUSEE) ---');
  if (gToken) {
    const cible = (await get(gToken, '/api/visites/gestionnaire/demande?page=0&size=1', 'demande (cible PATCH)'))[0];
    if (cible?.id != null) {
      // On NE modifie PAS réellement par défaut pour ne pas polluer les données.
      console.log(`     cible #${cible.id} (statut actuel: ${cible.statut}) — PATCH non exécuté (sécurité).`);
      console.log('     Pour tester réellement : décommente le bloc PATCH dans ce fichier.');
      // try {
      //   const r = await axios.patch(`${BASE}/api/visites/gestionnaire/demande/${cible.id}/statut/REFUSEE`, {}, H(gToken));
      //   console.log('  OK PATCH statut ->', r.status, JSON.stringify(r.data).slice(0,160));
      // } catch (e) { console.log('  ERR PATCH ->', e.response?.status, JSON.stringify(e.response?.data)?.slice(0,160)); }
    } else {
      console.log('     aucune demande à cibler pour le PATCH.');
    }
  }

  console.log('\n========================================');
  console.log('  FIN. Vérifie les lignes "MANQUANT" ci-dessus.');
  console.log('========================================');
})().catch((e) => console.error('Erreur fatale:', e.message));
