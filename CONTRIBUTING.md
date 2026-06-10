# CONTRIBUTING — Exécution locale & CI

Commandes locales utiles

Install dependencies

```bash
npm install
```

Démarrer le serveur de dev (Vite)

```bash
npm run dev
```

Tests unitaires (Vitest)

```bash
npm run test:unit
```

Tests E2E (Playwright)

```bash
# Démarrer le serveur dev dans un terminal
npm run dev

# Dans un autre terminal, exécuter les E2E
npm run test:e2e
```

Audit dépendances

```bash
npm audit --json
```

Scan sécurité front-end (script local)

```bash
npm run test:security
```

CI suggestion (GitHub Actions)

- Job `test`: installe les dépendances, exécute `npm run test:unit`, puis `npm run test:security`.
- Job `e2e`: démarre l'application en background (serveur de dev ou build+preview) puis exécute `npm run test:e2e`.

Conseils

- Exécuter les tests unitaires en local avant de push/pull-request.
- Pour Playwright, assurez-vous que le port (par défaut `5175`) est disponible ou adaptez `playwright.config.cjs`.
- CSP : ajuster `index.html` si des fonts ou assets externes sont bloqués.
