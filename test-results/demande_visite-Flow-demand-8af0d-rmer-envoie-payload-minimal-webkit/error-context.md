# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demande_visite.spec.js >> Flow demander visite (pendingAction -> login -> confirmer) envoie payload minimal
- Location: tests\e2e\demande_visite.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/locataire/succes-visite/42" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - banner [ref=e5]:
      - generic [ref=e6]:
        - link "NEKASO" [ref=e7]:
          - /url: /locataire/mes-locations
          - img "NEKASO" [ref=e8]
        - navigation [ref=e9]:
          - link "Liste des biens" [ref=e10]:
            - /url: /catalogue
          - link "Mes locations" [ref=e11]:
            - /url: /locataire/mes-locations
          - link "Contrat & Paiements" [ref=e12]:
            - /url: /locataire/contrat-paiements
        - button "Déconnexion" [ref=e14] [cursor=pointer]:
          - img [ref=e15]
          - text: Déconnexion
    - generic [ref=e19]:
      - link "Retour aux biens" [ref=e20]:
        - /url: /catalogue
        - img [ref=e21]
        - text: Retour aux biens
      - generic [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]:
            - img "Appartement moderne - Vue sur mer" [ref=e27]
            - generic [ref=e28]:
              - img "Appartement moderne - Vue sur mer 1" [ref=e29] [cursor=pointer]
              - img "Appartement moderne - Vue sur mer 2" [ref=e30] [cursor=pointer]
              - img "Appartement moderne - Vue sur mer 3" [ref=e31] [cursor=pointer]
          - generic [ref=e32]:
            - generic [ref=e33]:
              - heading "Appartement moderne - Vue sur mer" [level=1] [ref=e34]
              - generic [ref=e35]: disponible
            - generic [ref=e36]:
              - img [ref=e37]
              - text: Les Almadies, Dakar
          - generic [ref=e40]:
            - generic [ref=e41]:
              - img [ref=e43]
              - generic [ref=e45]:
                - generic [ref=e46]: "3"
                - generic [ref=e47]: Chambres
            - generic [ref=e48]:
              - img [ref=e50]
              - generic [ref=e52]:
                - generic [ref=e53]: "2"
                - generic [ref=e54]: Salles de bain
            - generic [ref=e55]:
              - img [ref=e57]
              - generic [ref=e59]:
                - generic [ref=e60]: "110"
                - generic [ref=e61]: m²
          - generic [ref=e62]:
            - heading "Description" [level=2] [ref=e63]
            - paragraph [ref=e64]: Magnifique appartement de 3 chambres avec vue panoramique sur l'océan. Situé dans un quartier résidentiel calme et sécurisé des Almadies, proche des commerces et restaurants.
          - generic [ref=e65]:
            - heading "Équipements" [level=2] [ref=e66]
            - generic [ref=e67]:
              - generic [ref=e68]:
                - img [ref=e69]
                - text: Climatisation
              - generic [ref=e71]:
                - img [ref=e72]
                - text: Wifi
              - generic [ref=e74]:
                - img [ref=e75]
                - text: Parking
              - generic [ref=e77]:
                - img [ref=e78]
                - text: Cuisine équipée
              - generic [ref=e80]:
                - img [ref=e81]
                - text: Gardien 24/7
              - generic [ref=e83]:
                - img [ref=e84]
                - text: Balcon
        - generic [ref=e87]:
          - generic [ref=e88]:
            - generic [ref=e89]: 450 000 FCFA /mois
            - generic [ref=e90]: Caution 2 mois — 1er mois dû à la signature
          - generic [ref=e91]:
            - button "Demander une visite" [ref=e92] [cursor=pointer]:
              - img [ref=e93]
              - text: Demander une visite
            - button "Demander une location" [ref=e95] [cursor=pointer]:
              - img [ref=e96]
              - text: Demander une location
            - button "Contacter via WhatsApp" [ref=e99] [cursor=pointer]:
              - img [ref=e100]
              - text: Contacter via WhatsApp
            - button "Appeler" [ref=e102] [cursor=pointer]:
              - img [ref=e103]
              - text: Appeler
          - generic [ref=e105]:
            - generic [ref=e106]: GESTIONNAIRE
            - generic [ref=e107]:
              - generic [ref=e108]: MD
              - generic [ref=e109]:
                - generic [ref=e110]: Mme Diop
                - generic [ref=e111]: "Téléphone : +221 77 123 45 67"
  - generic [ref=e112]:
    - generic "Toggle devtools panel" [ref=e113] [cursor=pointer]:
      - img [ref=e114]
    - generic "Toggle Component Inspector" [ref=e119] [cursor=pointer]:
      - img [ref=e120]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('Flow demander visite (pendingAction -> login -> confirmer) envoie payload minimal', async ({ page }) => {
  4  |   const bienId = 42
  5  |   // Intercept POST and return success
  6  |   let captured = null
  7  |   await page.route('**/visites/demander', async (route) => {
  8  |     const req = route.request()
  9  |     const postData = req.postData() || ''
  10 |     try {
  11 |       captured = JSON.parse(postData)
  12 |     } catch (e) {}
  13 |     await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 101, statut: 'EN_ATTENTE' }) })
  14 |   })
  15 | 
  16 |   // Start at bien detail (not authenticated)
  17 |   await page.goto(`/biens/${bienId}`)
  18 |   await page.click('button:has-text("Demander une visite")')
  19 | 
  20 |   // Redirects to login
  21 |   await page.waitForURL('**/login')
  22 | 
  23 |   // Inject mock auth before navigating back so pendingAction is processed automatically
  24 |   await page.context().addInitScript(() => {
  25 |     window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.TOKEN')
  26 |     window.sessionStorage.setItem('nekaso_user', JSON.stringify({ id: 2, role: 'LOCATAIRE' }))
  27 |   })
  28 |   await page.goto(`/biens/${bienId}`)
  29 | 
  30 |   // Modal should appear
  31 |   await page.waitForSelector('div.modal')
  32 |   // Confirm the request
  33 |   await Promise.all([
> 34 |     page.waitForURL(`**/locataire/succes-visite/${bienId}`),
     |          ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  35 |     page.click('div.modal button:has-text("Confirmer")'),
  36 |   ])
  37 | 
  38 |   expect(captured).toEqual({ idBien: bienId, idLocataire: 2 })
  39 | })
  40 | 
```