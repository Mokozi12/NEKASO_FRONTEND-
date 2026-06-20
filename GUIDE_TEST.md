# 🧪 Guide de test — NEKASO Frontend

Ce guide explique comment tester **tous** les endpoints et tous les écrans, côté
**locataire** et côté **gestionnaire**.

Il y a deux niveaux de test :
1. **Test API automatique** (scripts Node) — vérifie que le backend répond correctement.
2. **Test dans l'application** (navigateur) — vérifie l'affichage et les actions.

---

## 1. Prérequis

```bash
npm install            # une seule fois
```

- Backend de dev : `http://74.248.184.17:8080` (déjà configuré).
- En dev, l'app passe par le proxy Vite (`/api` → backend), donc **pas de souci CORS**.

### Identifiants de test

| Rôle | Téléphone | Mot de passe | Remarque |
|------|-----------|--------------|----------|
| Locataire | `770000999` | `Test@1234` | créé automatiquement par les scripts |
| Gestionnaire | **à fournir** | **à fournir** | ⚠️ `777585638 / 123456` ne marche plus |

> ❗ **Important** : il faut un compte **gestionnaire valide** pour tester la moitié
> gestionnaire. Remplace `GEST_TEL` / `GEST_PWD` dans les commandes ci-dessous.

---

## 2. Test API automatique

### 2.1 Test global (recommandé)

Teste **tous les endpoints** des deux rôles en une fois.

```bash
# Lecture seule (ne modifie aucune donnée) :
node test_complet.cjs

# Avec identifiants gestionnaire :
GEST_TEL=771234567 GEST_PWD=tonMotDePasse node test_complet.cjs

# Avec écritures (valide une visite + une demande en attente) :
WRITE=1 GEST_TEL=771234567 GEST_PWD=tonMotDePasse node test_complet.cjs
```

> Sous PowerShell, préfixe les variables ainsi :
> ```powershell
> $env:GEST_TEL="771234567"; $env:GEST_PWD="tonMotDePasse"; node test_complet.cjs
> ```

### 2.2 Lecture des résultats

| Symbole | Signification |
|---------|---------------|
| ✅ OK | L'endpoint répond `200/201`, tout va bien |
| 🔒 403 | Le bon endpoint existe, mais **mauvais rôle / token** (normal si pas connecté avec le bon rôle) |
| ⚪ 404 | Liste **vide** (ex. aucune demande) — traité comme normal par le front |
| 🟡 409 | Donnée **déjà existante** (ex. demande déjà en attente) — normal |
| ❌ | **À corriger** (route absente, 500, erreur réseau) |

➡️ **Objectif** : aucun ❌. Les 🔒 disparaissent dès qu'on fournit un token du bon rôle.

### 2.3 Tests ciblés (pour creuser)

```bash
node test_visites.cjs     # contrôleur visites en détail (forme des réponses)
node test_locataire.cjs   # parcours locataire : visites + demandes
```

---

## 3. Test dans l'application (navigateur)

```bash
npm run dev
```

Puis ouvre l'URL affichée (en général `http://localhost:5173`).

### 3.1 Parcours LOCATAIRE

Connecte-toi avec `770000999` / `Test@1234`.

- [ ] **Accueil** — les compteurs s'affichent (biens, visites, demandes).
- [ ] **Parcourir les biens** — la liste des biens disponibles s'affiche avec photos.
- [ ] **Détail d'un bien** — infos + bouton « Demander une visite » / « Demander à louer ».
- [ ] **Demander une visite** → message de succès.
- [ ] **Mes demandes de visite** — la demande apparaît avec le bien, statut « En attente ».
- [ ] **Demander une location** → message de succès.
- [ ] **Mes demandes de location** — la demande apparaît avec photo + libellé du bien + statut.
- [ ] **Mes locations** — vide tant qu'aucun bail actif (normal).
- [ ] **Mon contrat / Profil** — s'affichent sans erreur.

### 3.2 Parcours GESTIONNAIRE

Connecte-toi avec un compte gestionnaire valide.

- [ ] **Tableau de bord** — statistiques affichées.
- [ ] **Biens** — liste de mes biens ; **créer** un bien (formulaire + photos) ; **modifier** ; changer le statut.
- [ ] **Demandes de visite** — onglets *En attente / Validées / Confirmées / Clôturées*.
  - [ ] **Valider** une visite (créneau + agent) → passe en « Validée ».
  - [ ] **Refuser** une visite.
  - [ ] **Clôturer** une visite confirmée (avec / sans contrat).
- [ ] **Demandes de location** — liste par bien ; **valider** une demande.
- [ ] **Pré-contrats** — création depuis une demande validée ; valider / modifier.
- [ ] **Contrats** — édition d'un contrat depuis un pré-contrat validé ; liste filtrable.
- [ ] **Paiements** — historique d'un contrat ; enregistrer un paiement (mois + méthode).
- [ ] **Alertes / Agents** — s'affichent sans erreur.

> 💡 Ouvre la **console du navigateur** (F12) pendant les tests : toute erreur
> d'API y est loguée (statut + message).

---

## 4. Workflow complet de bout en bout (le « chemin heureux »)

Pour vérifier toute la chaîne métier :

1. **Locataire** : demande une visite OU une location sur un bien.
2. **Gestionnaire** : valide la demande de visite (créneau + agent) puis la clôture *avec contrat*,
   **ou** valide la demande de location.
3. **Gestionnaire** : crée un **pré-contrat** (depuis la demande/visite).
4. **Locataire** : **valide** le pré-contrat.
5. **Gestionnaire** : édite le **contrat** définitif depuis le pré-contrat validé.
6. **Gestionnaire** : enregistre un **paiement** ; le **locataire** voit l'historique.

---

## 5. Dépannage

| Problème | Cause probable / solution |
|----------|---------------------------|
| `login GESTIONNAIRE ÉCHOUÉ` | Mauvais identifiants → fournir un compte gestionnaire valide. |
| Tous les endpoints gestionnaire en 🔒 403 | Pas de token gestionnaire (voir ci-dessus). |
| `❌ 500` sur paiements | L'`idContrat` n'existe pas / n'appartient pas au compte → utiliser un vrai contrat. |
| Liste vide alors qu'il devrait y avoir des données | Vérifier le rôle du compte connecté et le statut filtré. |
| Page blanche après login | Token expiré → se reconnecter (le front redirige vers `/login`). |

---

## 6. État connu (au dernier test)

**Vérifié ✅** (côté locataire, contre le vrai backend) :
- Auth (register + login), Biens disponibles, Visites (créer + lister),
  Demandes de location (créer + lister), Pré-contrats & Contrats (listes vides OK).

**À vérifier** ⏳ (nécessite un compte gestionnaire valide) :
- Tout le côté gestionnaire : biens (CRUD), visites (valider/clôturer),
  demandes (valider), pré-contrats, contrats, paiements.

> Une fois les identifiants gestionnaire fournis, relancer :
> `WRITE=1 GEST_TEL=… GEST_PWD=… node test_complet.cjs`
