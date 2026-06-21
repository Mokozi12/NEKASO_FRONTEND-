const fs = require('fs');
const data = JSON.parse(fs.readFileSync('api-docs.json'));
const paths = Object.keys(data.paths).filter(p => p.toLowerCase().includes('contrat'));
paths.forEach(p => {
    const methods = Object.keys(data.paths[p]).map(m => m.toUpperCase()).join(',');
    console.log(p + ' [' + methods + ']');
});
