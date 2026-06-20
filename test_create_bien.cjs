const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testCreateBien() {
  const baseURL = 'http://74.248.184.17:8080';
  
  // Login first
  let token;
  try {
    const res = await axios.post(`${baseURL}/api/v1/auth/login`, {
      telephone: '777585638',
      motDePasse: '123456'
    });
    token = res.data.token;
    console.log('Logged in successfully.');
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    return;
  }

  // Test Create Bien
  const form = new FormData();
  form.append('typeBien', 'APPARTEMENT');
  form.append('libelle', 'Appartement Test');
  form.append('adresse', 'Dakar');
  form.append('surface', '100');
  form.append('nombrePieces', '4');
  form.append('loyer', '150000');
  form.append('description', 'Test Description');
  form.append('gestionnaireId', '1');

  try {
    const res = await axios.post(`${baseURL}/api/biens/gestionnaire/create`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders()
      }
    });
    console.log('Create Bien Success:', res.status, res.data);
  } catch (err) {
    console.error('Create Bien Error:', err.response?.status, err.response?.data || err.message);
  }
}

testCreateBien();
