const axios = require('axios');

async function test() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://74.248.184.17:8080/api/auth/login', {
      telephone: "771234567",
      motDePasse: "password"
    });
    const token = loginRes.data.message.token;
    console.log("Token obtenu");

    // 2. Test payment endpoint with different month formats
    const tests = ["Août 2026", "AOUT", "08-2026", "aout", "2026-08", "08/2026"];
    for (const mois of tests) {
      console.log(`\nTesting: ${mois}`);
      try {
        const res = await axios.post(
          `http://74.248.184.17:8080/api/paiements/gestionnaire/create/1/${encodeURIComponent(mois)}/ORANGE_MONEY`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Success:", res.status, res.data);
      } catch (err) {
        console.log("Error:", err.response ? err.response.status : err.message);
        console.log("Data:", err.response ? err.response.data : "");
      }
    }
  } catch (err) {
    console.error("Login failed:", err.message);
  }
}
test();
