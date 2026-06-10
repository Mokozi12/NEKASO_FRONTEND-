# Changelog — Résumé des changements récents (fr)

Date: 2026-06-10

Principales modifications réalisées dans cette itération :

- Tests
  - Ajout de tests unitaires et d'intégration (Vitest) pour les stores, services et composants clés.
  - Ajout de tests snapshot pour `HeaderGestionnaire` et `CarteBien`.

- Qualité & Sécurité
  - Script de vérification statique `scripts/security-check.cjs` (v-html, innerHTML, eval, document.write).
  - Content Security Policy (CSP) minimale ajoutée dans `index.html` avec whitelist pour Google Fonts.
  - Centralisation du stockage et vérification JWT (services/utilitaires existants ajustés).

- API & Services
  - Garantir que `POST /visites/demander` et `POST /demandes-location/creer` n'envoient que `{ idBien, idLocataire }` numériques.

- Développement & CI
  - Configuration de `vitest` (jsdom + plugin-vue) — `vitest.config.js`.
  - Ajout du runner Playwright et tests E2E de base (`playwright.config.cjs`, `tests/e2e/visites.spec.js`).

- UI
  - `HeaderGestionnaire.vue` rendu dynamique : badge notifications et dropdown.
  - Restauration / vérification de `VisitesView.vue` côté gestionnaire.

Fichiers importants créés/édités :

- Tests: `test/unit/**`, `test/integration/**`, `tests/e2e/**`
- Config: `vitest.config.js`, `playwright.config.cjs`
- Scripts: `scripts/security-check.cjs`
- Composants: `src/components/layout/HeaderGestionnaire.vue` (ajout dynamique badge/dropdown)

Notes pour la revue

- Les tests unitaires et d'intégration ont été exécutés localement et sont passés.
- Les tests E2E ont une configuration initiale et un scénario minimal ; il faut lancer Playwright localement (le dev server doit être en route) avant d'exécuter la suite complète.

Prochaines étapes recommandées

1. Ajouter scénarios E2E complets (login, création de demande visite/location, pagination).
2. Ajouter tests de sécurité automatisés (vérification CSP/reporting).
3. Préparer la PR vers `develop` et demander revue.
