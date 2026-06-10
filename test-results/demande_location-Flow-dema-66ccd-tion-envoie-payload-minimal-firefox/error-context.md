# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demande_location.spec.js >> Flow demander location envoie payload minimal
- Location: tests\e2e\demande_location.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/locataire/succes-location/55" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - banner [ref=e5]:
      - generic [ref=e6]:
        - link "NEKASO" [ref=e7] [cursor=pointer]:
          - /url: /locataire/mes-locations
          - img "NEKASO" [ref=e8]
        - navigation [ref=e9]:
          - link "Liste des biens" [ref=e10] [cursor=pointer]:
            - /url: /catalogue
          - link "Mes locations" [ref=e11] [cursor=pointer]:
            - /url: /locataire/mes-locations
          - link "Contrat & Paiements" [ref=e12] [cursor=pointer]:
            - /url: /locataire/contrat-paiements
        - button "Déconnexion" [ref=e14] [cursor=pointer]:
          - img [ref=e15]
          - text: Déconnexion
    - generic [ref=e20]:
      - link "Retour aux biens" [ref=e21] [cursor=pointer]:
        - /url: /catalogue
        - img [ref=e22]
        - text: Retour aux biens
      - generic [ref=e25]:
        - generic [ref=e26]:
          - generic [ref=e27]:
            - img "Appartement moderne - Vue sur mer" [ref=e29]
            - generic [ref=e30]:
              - img "Appartement moderne - Vue sur mer 1" [ref=e31] [cursor=pointer]
              - img "Appartement moderne - Vue sur mer 2" [ref=e32] [cursor=pointer]
              - img "Appartement moderne - Vue sur mer 3" [ref=e33] [cursor=pointer]
          - generic [ref=e34]:
            - generic [ref=e35]:
              - heading "Appartement moderne - Vue sur mer" [level=1] [ref=e36]
              - generic [ref=e37]: disponible
            - generic [ref=e38]:
              - img [ref=e39]
              - text: Les Almadies, Dakar
          - generic [ref=e42]:
            - generic [ref=e43]:
              - img [ref=e45]
              - generic [ref=e47]:
                - generic [ref=e48]: "3"
                - generic [ref=e49]: Chambres
            - generic [ref=e50]:
              - img [ref=e52]
              - generic [ref=e55]:
                - generic [ref=e56]: "2"
                - generic [ref=e57]: Salles de bain
            - generic [ref=e58]:
              - img [ref=e60]
              - generic [ref=e62]:
                - generic [ref=e63]: "110"
                - generic [ref=e64]: m²
          - generic [ref=e65]:
            - heading "Description" [level=2] [ref=e66]
            - paragraph [ref=e67]: Magnifique appartement de 3 chambres avec vue panoramique sur l'océan. Situé dans un quartier résidentiel calme et sécurisé des Almadies, proche des commerces et restaurants.
          - generic [ref=e68]:
            - heading "Équipements" [level=2] [ref=e69]
            - generic [ref=e70]:
              - generic [ref=e71]:
                - img [ref=e72]
                - text: Climatisation
              - generic [ref=e74]:
                - img [ref=e75]
                - text: Wifi
              - generic [ref=e77]:
                - img [ref=e78]
                - text: Parking
              - generic [ref=e80]:
                - img [ref=e81]
                - text: Cuisine équipée
              - generic [ref=e83]:
                - img [ref=e84]
                - text: Gardien 24/7
              - generic [ref=e86]:
                - img [ref=e87]
                - text: Balcon
        - generic [ref=e90]:
          - generic [ref=e91]:
            - generic [ref=e92]: 450 000 FCFA /mois
            - generic [ref=e93]: Caution 2 mois — 1er mois dû à la signature
          - generic [ref=e94]:
            - button "Demander une visite" [ref=e95] [cursor=pointer]:
              - img [ref=e96]
              - text: Demander une visite
            - button "Demander une location" [ref=e101] [cursor=pointer]:
              - img [ref=e102]
              - text: Demander une location
            - button "Contacter via WhatsApp" [ref=e108] [cursor=pointer]:
              - img [ref=e109]
              - text: Contacter via WhatsApp
            - button "Appeler" [ref=e111] [cursor=pointer]:
              - img [ref=e112]
              - text: Appeler
          - generic [ref=e114]:
            - generic [ref=e115]: GESTIONNAIRE
            - generic [ref=e116]:
              - generic [ref=e117]: MD
              - generic [ref=e118]:
                - generic [ref=e119]: Mme Diop
                - generic [ref=e120]: "Téléphone : +221 77 123 45 67"
  - generic [ref=e121]:
    - generic "Toggle devtools panel" [ref=e122] [cursor=pointer]:
      - img [ref=e123]
    - generic "Toggle Component Inspector" [ref=e128] [cursor=pointer]:
      - img [ref=e129]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('Flow demander location envoie payload minimal', async ({ page }) => {
  4  |   const bienId = 55
  5  |   let captured = null
  6  |   await page.route('**/demandes-location/creer', async (route) => {
  7  |     const req = route.request()
  8  |     const postData = req.postData() || ''
  9  |     try {
  10 |       captured = JSON.parse(postData)
  11 |     } catch (e) {}
  12 |     await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 202, statut: 'EN_ATTENTE' }) })
  13 |   })
  14 | 
  15 |   await page.goto(`/biens/${bienId}`)
  16 |   await page.click('button:has-text("Demander une location")')
  17 |   await page.waitForURL('**/login')
  18 | 
  19 |   // Inject mock auth before navigating back so pendingAction is processed automatically
  20 |   await page.context().addInitScript(() => {
  21 |     window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.TOKEN')
  22 |     window.sessionStorage.setItem('nekaso_user', JSON.stringify({ id: 2, role: 'LOCATAIRE' }))
  23 |   })
  24 |   await page.goto(`/biens/${bienId}`)
  25 | 
  26 |   await page.waitForSelector('div.modal')
  27 |   await Promise.all([
> 28 |     page.waitForURL(`**/locataire/succes-location/${bienId}`),
     |          ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  29 |     page.click('div.modal button:has-text("Confirmer")'),
  30 |   ])
  31 | 
  32 |   expect(captured).toEqual({ idBien: bienId, idLocataire: 2 })
  33 | })
  34 | 
```