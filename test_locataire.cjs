/*
  Test des endpoints LOCATAIRE (visites + demandes de location).
  Vérifie la forme réelle des réponses vs ce qu'attendent les mappers du front.

  Usage :  node test_locataire.cjs
*/
const axios = require('axios');
const BASE = process.env.NEKASO_BASE || 'http://74.248.184.17:8080';
const LOC = { telephone: '770000999', motDePasse: 'Test@1234', prenom: 'TestPrenom', nom: 'TestNom' };
const pick = (d) => d?.token || d?.message?.token || d?.data?.token;
const H = (t) => ({ headers: { Authorization: `Bearer ${t}` } });

async function login() {
  try { await axios.post(`${BASE}/api/v1/auth/register`, LOC); } catch (e) {}
  const res = await axios.post(`${BASE}/api/v1/auth/login`, { telephone: LOC.telephone, motDePasse: LOC.motDePasse });
  return pick(res.data);
}

function audit(label, liste, champs) {
  console.log(`     ${label} : ${liste.length} élément(s)`);
  const v = liste[0];
  if (!v) return;
  console.log('     champs reçus :', Object.keys(v).join(', '));
  for (const [nom, accar] of Object.entries(champs)) {
    const val = accar(v);
    console.log(`     ${nom.padEnd(16)}: ${val === undefined || val === null ? 'MANQUANT' : 'OK'}`);
  }
}

async function getList(token, url, label, champs) {
  try {
    const res = await axios.get(`${BASE}${url}`, H(token));
    const body = res.data;
    const liste = Array.isArray(body) ? body : (body?.data || body?.content || []);
    console.log(`  OK   ${label} -> ${res.status}`);
    audit(label, liste, champs);
    return liste;
  } catch (e) {
    const s = e.response?.status;
    console.log(`  ${s === 404 ? 'VIDE' : 'ERR '} ${label} -> ${s}: ${JSON.stringify(e.response?.data)?.slice(0,120)}`);
    return [];
  }
}

(async () => {
  console.log('=== TEST endpoints LOCATAIRE ===');
  console.log('BASE =', BASE, '\n');
  const t = await login();
  if (!t) { console.log('FAIL login locataire'); return; }
  console.log('Login locataire OK\n');

  // Un bien disponible pour les créations
  let bienId = null;
  try {
    const d = await axios.get(`${BASE}/api/biens/locataire/biens_disponibles?page=0&size=1`, H(t));
    bienId = (d.data?.data || d.data?.content || d.data || [])[0]?.id;
  } catch (e) {}
  console.log('Bien cible :', bienId, '\n');

  const champsVisite = {
    id: (v) => v.id, statut: (v) => v.statut, dateCreation: (v) => v.dateCreation,
    id_Locataire: (v) => v.id_Locataire, 'bien.libelle': (v) => v.bien?.libelle, 'bien.photos': (v) => v.bien?.photos,
  };
  const champsDemande = {
    id: (v) => v.id, statut: (v) => v.statut, 'date': (v) => v.dateDemande ?? v.dateCreation,
    id_Locataire: (v) => v.id_Locataire, 'bien.libelle': (v) => v.bien?.libelle,
  };

  console.log('--- A) Demande de VISITE ---');
  if (bienId) {
    try {
      const r = await axios.post(`${BASE}/api/visites/locataire/bien/${bienId}`, {}, H(t));
      console.log('  OK   POST /api/visites/locataire/bien/' + bienId, '->', r.status, JSON.stringify(r.data).slice(0,120));
    } catch (e) { console.log('  ERR  POST visite ->', e.response?.status, JSON.stringify(e.response?.data)?.slice(0,120)); }
  }
  await getList(t, '/api/visites/locataire/mes_demandes?page=0&size=5', 'GET visites/mes_demandes', champsVisite);

  console.log('\n--- B) Demande de LOCATION ---');
  if (bienId) {
    try {
      const r = await axios.post(`${BASE}/api/demandes/locataire/bien/${bienId}`, {}, H(t));
      console.log('  OK   POST /api/demandes/locataire/bien/' + bienId, '->', r.status, JSON.stringify(r.data).slice(0,120));
    } catch (e) { console.log('  ' + (e.response?.status===409?'DEJA':'ERR ') + ' POST demande ->', e.response?.status, JSON.stringify(e.response?.data)?.slice(0,120)); }
  }
  await getList(t, '/api/demandes/locataire?page=0&size=5', 'GET demandes/locataire', champsDemande);

  console.log('\n=== FIN — vérifie les "MANQUANT" ===');
})().catch((e) => console.error('Fatal:', e.message));
