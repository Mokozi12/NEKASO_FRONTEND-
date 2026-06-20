# Intégration API NEKASO — guide de test

Backend : `http://74.248.184.17:8080` — toutes les routes sont sous `/api/...`.

## Configuration

En **dev**, on passe par un **proxy Vite** pour éviter le CORS : le navigateur
n'appelle que `localhost:5173/api/...` et Vite relaie vers le backend.

`.env.development` :
```
VITE_API_URL=/api
VITE_PROXY_TARGET=http://74.248.184.17:8080
VITE_DEV_LOCATAIRE_ID=2
VITE_DEV_GESTIONNAIRE_ID=1
```
Le proxy est configuré dans `vite.config.js` (`server.proxy['/api']`).

⚠️ **Après toute modif de `vite.config.js` ou `.env`, redémarre `npm run dev`.**

### En production
`.env.production` garde `VITE_API_URL=https://nekaso.me/api`. Pour que ça marche,
soit le frontend et `/api` sont servis depuis le même domaine (pas de CORS), soit
le backend doit ajouter l'en-tête `Access-Control-Allow-Origin` pour le domaine du front.

## Compte de test déjà créé
Un locataire de test a été créé pour vérifier l'intégration :
- **Téléphone** : `780000199`
- **Mot de passe** : `Test1234`

(Tu peux le supprimer côté backend si tu veux.)

---

## Architecture de l'intégration

- **`src/utils/apiResponse.js`** — normalise les 3 formes de réponse du backend :
  - enveloppe auth `{ success, message: <payload>, status, timestamp }`
  - page « maison » `{ data:[...], totalElements, totalPages, currentPage, pageSize, isFirst, isLast }`
  - page Spring `{ content:[...], number, size, totalElements, totalPages }`
- **`src/services/mappers.js`** — traduit les champs backend → front (ex. `libelle` → `intitule`).
- **`src/services/*.service.js`** — un service par contrôleur, chemins alignés sur le Swagger.

---

## Ce qui est branché sur le VRAI backend ✅

| Écran / fonction | Endpoint | Comment tester |
|---|---|---|
| **Connexion** | `POST /v1/auth/login` | `/login` → téléphone `780000199`, mdp `Test1234`. Le rôle vient de `roles[]`. |
| **Inscription** | `POST /v1/auth/register` (+ login auto) | onglet Inscription → crée un compte, te connecte automatiquement. |
| **Biens du gestionnaire** | `GET /biens/gestionnaire` | connecté en gestionnaire → page **Biens** se remplit. |
| **Créer un bien** | `POST /biens/create` (multipart) | bouton « Ajouter un bien ». `gestionnaireId` injecté automatiquement. |
| **Modifier / changer statut** | `PATCH /biens/gestionnaire/update-bien/{id}` | éditer un bien, archiver. |
| **Catalogue locataire** | `GET /biens/locataire/biens_disponibles` | page catalogue / accueil locataire. ⚠️ voir bug #2. |
| **Historique paiements** | `GET /paiements/historiques-paiements/contrat/{id}` | `paiementsStore.chargerHistorique(contratId)`. |
| **Enregistrer paiement** | `POST /paiements/gestionnaire/create/{idContrat}/{mois}/{methode}` | `paiementsStore.enregistrerPaiementBackend(id, "Juin", "OM")`. |

Tous les autres services (visites, demandes, pré-contrats, contrats) sont **écrits et prêts** (chemins + mappers), mais leurs vues ne sont pas encore rebranchées (voir plus bas).

---

## 🔴 Problèmes backend à signaler à l'équipe back

1. **Le login ne renvoie pas l'`id` de l'utilisateur.** Réponse = `{ token, nom, prenom, telephone, roles }`. Or tous les endpoints `/locataire/{id}`, `/gestionnaire/{id}` ont besoin de cet id. **Workaround actuel** : on retombe sur `VITE_DEV_LOCATAIRE_ID` / `VITE_DEV_GESTIONNAIRE_ID`. **À corriger** : ajouter `id` dans la réponse de login.

2. **`GET /api/biens/locataire/biens_disponibles` renvoie 500** (erreur serveur), alors que `GET /api/biens/gestionnaire` fonctionne. Le catalogue locataire restera vide tant que ce 500 n'est pas corrigé côté backend.

3. **Réponses non homogènes** : auth enveloppe la charge utile dans `message`, certaines listes utilisent `data`, d'autres `content`. Géré côté front, mais à uniformiser idéalement.

4. **`mes_demandes` renvoie 404 quand la liste est vide** (au lieu d'une liste vide). Géré côté front (traité comme liste vide).

---

## 🟠 Limites de modèle de données (le backend ne fournit pas tout ce que l'UI affiche)

- **Visites (gestionnaire)** : le backend ne renvoie ni le **nom/téléphone du client**, ni le **créneau (date/heure)**, ni les **détails de l'agent**. Il n'existe pas non plus d'endpoint « liste des agents » (alors que confirmer une visite exige un `idAgent`). La validation backend = `confirmer/bien/{idBien}/agent/{idAgent}`.
- **Contrats** : pas de `dateFin`, pas d'**échéances**, pas d'infos **bien** ni **nom client** dans la réponse contrat.
- **Demandes de location** : seulement `bienId` (pas le bien complet) → il faut joindre avec la liste des biens.
- **Pas d'endpoints** pour : **Agents**, **Alertes/réparations**, **Notifications**.

➡️ Ces écrans restent donc sur les **données mock** pour ne rien casser. Pour les brancher, il faudra soit enrichir le backend, soit simplifier ces écrans.

---

## Comment tester maintenant (étapes)

1. `npm run dev`
2. Va sur `/login`, connecte-toi avec `780000199` / `Test1234` (rôle LOCATAIRE).
3. Ouvre la console réseau (F12) : les appels partent bien vers `http://74.248.184.17:8080/api/...` avec un header `Authorization: Bearer ...`.
4. Pour tester le **côté gestionnaire** (biens), il faut un **compte gestionnaire** — demande à l'équipe backend un téléphone/mdp gestionnaire, puis connecte-toi : la page Biens doit afficher les biens renvoyés par `/biens/gestionnaire`.
5. Crée un bien (max 5 photos) → vérifie qu'il apparaît après rechargement.

> Note : le rôle détermine la redirection. Le backend renvoie `roles:["LOCATAIRE"]` ou `["GESTIONNAIRE"]`.
