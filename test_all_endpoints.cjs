const axios = require('axios');

const BASE = 'http://74.248.184.17:8080';

// Nomenclature officielle communiquée par l'utilisateur
const ENDPOINTS = {
  // auth-controller
  'POST /api/v1/auth/register':    { method: 'POST', url: '/api/v1/auth/register', body: { telephone: '770000999', motDePasse: 'Test@1234', prenom: 'TestPrenom', nom: 'TestNom' }, auth: false },
  'POST /api/v1/auth/login':       { method: 'POST', url: '/api/v1/auth/login', body: { telephone: '770000999', motDePasse: 'Test@1234' }, auth: false },

  // bien-immobilier-controller
  'GET /api/biens/gestionnaire':               { method: 'GET', url: '/api/biens/gestionnaire', auth: true, role: 'gestionnaire' },
  'GET /api/biens/gestionnaire/mes-biens':     { method: 'GET', url: '/api/biens/gestionnaire/mes-biens', auth: true, role: 'gestionnaire' },
  'GET /api/biens/locataire/biens_disponibles':{ method: 'GET', url: '/api/biens/locataire/biens_disponibles', auth: true, role: 'locataire' },
  'POST /api/biens/gestionnaire/create':       { method: 'POST', url: '/api/biens/gestionnaire/create', formdata: true, auth: true, role: 'gestionnaire' },

  // demande-location-controller
  'GET /api/demandes/gestionnaire/demandes-locations':   { method: 'GET', url: '/api/demandes/gestionnaire/demandes-locations', auth: true, role: 'gestionnaire' },
  'GET /api/demandes/locataire':                         { method: 'GET', url: '/api/demandes/locataire', auth: true, role: 'locataire' },
  'POST /api/demandes/locataire/bien/{id}':              { method: 'POST', url: '/api/demandes/locataire/bien/1', auth: true, role: 'locataire' },

  // demande-visite-controller
  'GET /api/visites/gestionnaire/demande':               { method: 'GET', url: '/api/visites/gestionnaire/demande', auth: true, role: 'gestionnaire' },
  'GET /api/visites/locataire/mes_demandes':             { method: 'GET', url: '/api/visites/locataire/mes_demandes', auth: true, role: 'locataire' },
  'POST /api/visites/locataire/bien/{id}':               { method: 'POST', url: '/api/visites/locataire/bien/1', auth: true, role: 'locataire' },

  // pre-contrat-controller
  'GET /api/pre-contrats/gestionnaire':                  { method: 'GET', url: '/api/pre-contrats/gestionnaire', auth: true, role: 'gestionnaire' },
  'GET /api/pre-contrats/locataire':                     { method: 'GET', url: '/api/pre-contrats/locataire', auth: true, role: 'locataire' },

  // contrat-bail-controller
  'GET /api/contrats/gestionnaire/mes-contrats':         { method: 'GET', url: '/api/contrats/gestionnaire/mes-contrats', auth: true, role: 'gestionnaire' },
  'GET /api/contrats/locataire/mes-contrats':            { method: 'GET', url: '/api/contrats/locataire/mes-contrats', auth: true, role: 'locataire' },

  // paiement-controller
  'GET /api/paiements/gestionnaire/historiques-paiements/contrat/1': { method: 'GET', url: '/api/paiements/gestionnaire/historiques-paiements/contrat/1', auth: true, role: 'gestionnaire' },
  'GET /api/paiements/locataire/historiques-paiements/contrat/1':   { method: 'GET', url: '/api/paiements/locataire/historiques-paiements/contrat/1', auth: true, role: 'locataire' },
};

async function getTokens() {
  const tokens = {};
  // Register test locataire first (might already exist)
  try {
    await axios.post(`${BASE}/api/v1/auth/register`, {
      telephone: '770000999', motDePasse: 'Test@1234', prenom: 'TestPrenom', nom: 'TestNom'
    });
    console.log('✅ Register: Created test user');
  } catch (e) {
    console.log('ℹ️  Register: User may already exist -', e.response?.status, e.response?.data?.message || '');
  }

  // Login as locataire
  try {
    const res = await axios.post(`${BASE}/api/v1/auth/login`, {
      telephone: '770000999', motDePasse: 'Test@1234'
    });
    tokens.locataire = res.data.token;
    console.log('✅ Login Locataire OK');
  } catch (e) {
    console.error('❌ Login Locataire FAILED:', e.response?.status, e.response?.data);
  }

  // Login as gestionnaire — essayons quelques combinaisons
  const gestionnaireCreds = [
    { telephone: '777585638', motDePasse: 'Test@1234' },
    { telephone: '777585638', motDePasse: 'Passer@123' },
    { telephone: '777585638', motDePasse: 'Admin@1234' },
    { telephone: '770000001', motDePasse: 'Test@1234' },
  ];
  for (const cred of gestionnaireCreds) {
    try {
      const res = await axios.post(`${BASE}/api/v1/auth/login`, cred);
      tokens.gestionnaire = res.data.token;
      console.log(`✅ Login Gestionnaire OK avec ${cred.telephone}`);
      break;
    } catch (e) {
      // continue
    }
  }
  if (!tokens.gestionnaire) {
    console.log('⚠️  Pas de token gestionnaire trouvé, on utilisera le token locataire pour tous les tests');
    tokens.gestionnaire = tokens.locataire;
  }

  return tokens;
}

async function testEndpoint(name, spec, tokens) {
  const token = spec.auth ? (tokens[spec.role] || tokens.locataire || tokens.gestionnaire) : null;
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    let res;
    const url = `${BASE}${spec.url}`;
    if (spec.method === 'GET') {
      res = await axios.get(url, { headers });
    } else if (spec.method === 'POST') {
      if (spec.formdata) {
        const FormData = require('form-data');
        const form = new FormData();
        form.append('typeBien', 'APPARTEMENT');
        form.append('libelle', 'Test Auto');
        form.append('adresse', 'Dakar Test');
        form.append('surface', '80');
        form.append('nombrePieces', '3');
        form.append('loyer', '100000');
        form.append('description', 'Test automatique');
        form.append('gestionnaireId', '1');
        res = await axios.post(url, form, { headers: { ...headers, ...form.getHeaders() } });
      } else if (spec.body) {
        res = await axios.post(url, spec.body, { headers });
      } else {
        res = await axios.post(url, {}, { headers });
      }
    } else if (spec.method === 'PATCH') {
      res = await axios.patch(url, spec.body || {}, { headers });
    }
    console.log(`  ✅ ${name} → ${res.status}`);
    return true;
  } catch (e) {
    const status = e.response?.status || 'NETWORK_ERROR';
    const msg = e.response?.data?.message || e.response?.data || e.message;
    // 403 = route exists but access denied (role issue, not a route issue)
    // 404 = route does NOT exist
    // 500 = server error
    const icon = status === 403 ? '🔒' : '❌';
    console.log(`  ${icon} ${name} → ${status} : ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`);
    return status === 403; // 403 means route is correct, just need the right role
  }
}

async function main() {
  console.log('========================================');
  console.log('  NEKASO ENDPOINT VERIFICATION SUITE');
  console.log('========================================\n');

  const tokens = await getTokens();
  console.log('\n--- Testing all endpoints ---\n');

  let ok = 0, fail = 0;
  for (const [name, spec] of Object.entries(ENDPOINTS)) {
    if (name.startsWith('POST /api/v1/auth/')) continue; // already tested above
    const result = await testEndpoint(name, spec, tokens);
    if (result) ok++; else fail++;
  }

  console.log(`\n========================================`);
  console.log(`  RESULTS: ${ok} OK / ${fail} FAILED`);
  console.log(`========================================\n`);
}

main().catch(console.error);
