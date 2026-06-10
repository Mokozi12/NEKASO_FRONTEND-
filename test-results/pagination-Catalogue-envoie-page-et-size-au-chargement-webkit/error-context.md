# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pagination.spec.js >> Catalogue envoie page et size au chargement
- Location: tests\e2e\pagination.spec.js:3:1

# Error details

```
TimeoutError: page.waitForRequest: Timeout 15000ms exceeded while waiting for event "request"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - banner [ref=e5]:
      - generic [ref=e6]:
        - link "NEKASO" [ref=e7]:
          - /url: /
          - img "NEKASO" [ref=e8]
        - navigation [ref=e9]:
          - link "Liste des biens" [ref=e10]:
            - /url: /catalogue
        - generic [ref=e11]:
          - link "Espace Gestionnaire" [ref=e12]:
            - /url: /login-gestionnaire
          - link "Se connecter" [ref=e13]:
            - /url: /login
          - link "Créer un compte" [ref=e14]:
            - /url: /inscription
    - generic [ref=e16]:
      - generic [ref=e17]:
        - heading "Biens à louer à Dakar" [level=1] [ref=e18]
        - paragraph [ref=e19]: 8 logements trouvés
      - generic [ref=e20]:
        - generic [ref=e21]:
          - generic [ref=e22]:
            - img [ref=e23]
            - textbox "Rechercher un bien ou un quartier..." [ref=e26]
          - button "Filtres avancés" [ref=e27] [cursor=pointer]:
            - img [ref=e28]
        - generic [ref=e29]:
          - button "Tout" [ref=e30] [cursor=pointer]
          - button "Chambre" [ref=e31] [cursor=pointer]
          - button "Studio" [ref=e32] [cursor=pointer]
          - button "Appartement" [ref=e33] [cursor=pointer]
          - button "Villa" [ref=e34] [cursor=pointer]
      - generic [ref=e35]:
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]:
            - img "Appartement moderne - Vue sur mer" [ref=e38]
            - generic:
              - generic: Disponible
              - generic: Appartement
          - generic [ref=e39]:
            - heading "Appartement moderne - Vue sur mer" [level=3] [ref=e40]
            - generic [ref=e41]:
              - img [ref=e42]
              - text: Almadies, Dakar
            - generic [ref=e45]:
              - generic [ref=e46]:
                - img [ref=e47]
                - text: "3"
              - generic [ref=e49]:
                - img [ref=e50]
                - text: "2"
              - generic [ref=e53]:
                - img [ref=e54]
                - text: 110 m²
            - generic [ref=e57]:
              - generic [ref=e58]: 450 000 FCFA
              - generic [ref=e59]: /mois
        - generic [ref=e60] [cursor=pointer]:
          - generic [ref=e61]:
            - img "Studio meublé centre-ville" [ref=e62]
            - generic:
              - generic: Disponible
              - generic: Studio
          - generic [ref=e63]:
            - heading "Studio meublé centre-ville" [level=3] [ref=e64]
            - generic [ref=e65]:
              - img [ref=e66]
              - text: Plateau, Dakar
            - generic [ref=e69]:
              - generic [ref=e70]:
                - img [ref=e71]
                - text: "1"
              - generic [ref=e73]:
                - img [ref=e74]
                - text: "1"
              - generic [ref=e77]:
                - img [ref=e78]
                - text: 35 m²
            - generic [ref=e81]:
              - generic [ref=e82]: 200 000 FCFA
              - generic [ref=e83]: /mois
        - generic [ref=e84] [cursor=pointer]:
          - generic [ref=e85]:
            - img "Villa 4 chambres avec jardin" [ref=e86]
            - generic:
              - generic: Réservé
              - generic: Villa
          - generic [ref=e87]:
            - heading "Villa 4 chambres avec jardin" [level=3] [ref=e88]
            - generic [ref=e89]:
              - img [ref=e90]
              - text: Ngor, Dakar
            - generic [ref=e93]:
              - generic [ref=e94]:
                - img [ref=e95]
                - text: "4"
              - generic [ref=e97]:
                - img [ref=e98]
                - text: "3"
              - generic [ref=e101]:
                - img [ref=e102]
                - text: 220 m²
            - generic [ref=e105]:
              - generic [ref=e106]: 850 000 FCFA
              - generic [ref=e107]: /mois
        - generic [ref=e108] [cursor=pointer]:
          - generic [ref=e109]:
            - img "Chambre étudiante" [ref=e110]
            - generic:
              - generic: Disponible
              - generic: Chambre
          - generic [ref=e111]:
            - heading "Chambre étudiante" [level=3] [ref=e112]
            - generic [ref=e113]:
              - img [ref=e114]
              - text: Mermoz, Dakar
            - generic [ref=e117]:
              - generic [ref=e118]:
                - img [ref=e119]
                - text: "1"
              - generic [ref=e121]:
                - img [ref=e122]
                - text: "1"
              - generic [ref=e125]:
                - img [ref=e126]
                - text: 18 m²
            - generic [ref=e129]:
              - generic [ref=e130]: 90 000 FCFA
              - generic [ref=e131]: /mois
        - generic [ref=e132] [cursor=pointer]:
          - generic [ref=e133]:
            - img "Appartement familial" [ref=e134]
            - generic:
              - generic: Loué
              - generic: Appartement
          - generic [ref=e135]:
            - heading "Appartement familial" [level=3] [ref=e136]
            - generic [ref=e137]:
              - img [ref=e138]
              - text: Sacré-Cœur, Dakar
            - generic [ref=e141]:
              - generic [ref=e142]:
                - img [ref=e143]
                - text: "3"
              - generic [ref=e145]:
                - img [ref=e146]
                - text: "2"
              - generic [ref=e149]:
                - img [ref=e150]
                - text: 95 m²
            - generic [ref=e153]:
              - generic [ref=e154]: 350 000 FCFA
              - generic [ref=e155]: /mois
        - generic [ref=e156] [cursor=pointer]:
          - generic [ref=e157]:
            - img "Studio moderne avec balcon" [ref=e158]
            - generic:
              - generic: Disponible
              - generic: Studio
          - generic [ref=e159]:
            - heading "Studio moderne avec balcon" [level=3] [ref=e160]
            - generic [ref=e161]:
              - img [ref=e162]
              - text: Point E, Dakar
            - generic [ref=e165]:
              - generic [ref=e166]:
                - img [ref=e167]
                - text: "1"
              - generic [ref=e169]:
                - img [ref=e170]
                - text: "1"
              - generic [ref=e173]:
                - img [ref=e174]
                - text: 40 m²
            - generic [ref=e177]:
              - generic [ref=e178]: 180 000 FCFA
              - generic [ref=e179]: /mois
        - generic [ref=e180] [cursor=pointer]:
          - generic [ref=e181]:
            - img "Appartement 2 pièces" [ref=e182]
            - generic:
              - generic: Disponible
              - generic: Appartement
          - generic [ref=e183]:
            - heading "Appartement 2 pièces" [level=3] [ref=e184]
            - generic [ref=e185]:
              - img [ref=e186]
              - text: Yoff, Dakar
            - generic [ref=e189]:
              - generic [ref=e190]:
                - img [ref=e191]
                - text: "2"
              - generic [ref=e193]:
                - img [ref=e194]
                - text: "1"
              - generic [ref=e197]:
                - img [ref=e198]
                - text: 65 m²
            - generic [ref=e201]:
              - generic [ref=e202]: 220 000 FCFA
              - generic [ref=e203]: /mois
        - generic [ref=e204] [cursor=pointer]:
          - generic [ref=e205]:
            - img "Chambre en colocation" [ref=e206]
            - generic:
              - generic: Disponible
              - generic: Chambre
          - generic [ref=e207]:
            - heading "Chambre en colocation" [level=3] [ref=e208]
            - generic [ref=e209]:
              - img [ref=e210]
              - text: Fann, Dakar
            - generic [ref=e213]:
              - generic [ref=e214]:
                - img [ref=e215]
                - text: "1"
              - generic [ref=e217]:
                - img [ref=e218]
                - text: "1"
              - generic [ref=e221]:
                - img [ref=e222]
                - text: 22 m²
            - generic [ref=e225]:
              - generic [ref=e226]: 110 000 FCFA
              - generic [ref=e227]: /mois
  - generic [ref=e228]:
    - generic "Toggle devtools panel" [ref=e229] [cursor=pointer]:
      - img [ref=e230]
    - generic "Toggle Component Inspector" [ref=e235] [cursor=pointer]:
      - img [ref=e236]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('Catalogue envoie page et size au chargement', async ({ page }) => {
  4  |   // Wait for the catalogue page to load and the API call to occur.
> 5  |   const requestPromise = page.waitForRequest(
     |                               ^ TimeoutError: page.waitForRequest: Timeout 15000ms exceeded while waiting for event "request"
  6  |     (req) => req.url().includes('/biens/publics') && req.method() === 'GET',
  7  |     { timeout: 15000 },
  8  |   )
  9  | 
  10 |   await page.goto('/catalogue')
  11 |   const request = await requestPromise
  12 | 
  13 |   const url = new URL(request.url())
  14 |   expect(url.searchParams.get('page')).toBe('1')
  15 |   expect(url.searchParams.get('size')).toBe('20')
  16 | })
  17 | 
```