const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')

const patterns = [
  { re: /v-html/, desc: 'Utilisation de v-html (injections HTML)' },
  { re: /\.innerHTML/, desc: 'Accès à innerHTML (injections possible)' },
  { re: /document\.write\(/, desc: 'document.write détecté' },
  { re: /eval\(/, desc: 'eval() détecté' },
  { re: /new Function\(/, desc: 'new Function() détecté' },
]

function walk(dir, cb) {
  const list = fs.readdirSync(dir)
  list.forEach((f) => {
    const full = path.join(dir, f)
    const stat = fs.statSync(full)
    if (stat && stat.isDirectory()) {
      walk(full, cb)
    } else if (full.endsWith('.js') || full.endsWith('.vue')) {
      cb(full)
    }
  })
}

let found = []
walk(SRC, (file) => {
  const content = fs.readFileSync(file, 'utf8')
  patterns.forEach((p) => {
    if (p.re.test(content)) {
      found.push({ file, desc: p.desc, match: content.match(p.re)[0] })
    }
  })
})

if (found.length > 0) {
  console.error('Sécurité frontend: patterns potentiellement dangereux détectés:')
  found.forEach((f) => console.error(`- ${f.file}: ${f.desc} -> ${f.match}`))
  process.exitCode = 2
} else {
  console.log('Security check: passed — pas de patterns dangereux trouvés')
}
