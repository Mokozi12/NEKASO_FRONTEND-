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
        - link "NEKASO" [ref=e7] [cursor=pointer]:
          - /url: /
          - img "NEKASO" [ref=e8]
        - navigation [ref=e9]:
          - link "Liste des biens" [ref=e10] [cursor=pointer]:
            - /url: /catalogue
        - generic [ref=e11]:
          - link "Espace Gestionnaire" [ref=e12] [cursor=pointer]:
            - /url: /login-gestionnaire
          - link "Se connecter" [ref=e13] [cursor=pointer]:
            - /url: /login
          - link "Créer un compte" [ref=e14] [cursor=pointer]:
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
        - generic [ref=e38]:
          - button "Tout" [ref=e39] [cursor=pointer]
          - button "Chambre" [ref=e40] [cursor=pointer]
          - button "Studio" [ref=e41] [cursor=pointer]
          - button "Appartement" [ref=e42] [cursor=pointer]
          - button "Villa" [ref=e43] [cursor=pointer]
      - generic [ref=e44]:
        - generic [ref=e45] [cursor=pointer]:
          - generic [ref=e46]:
            - img "Appartement moderne - Vue sur mer" [ref=e47]
            - generic:
              - generic: Disponible
              - generic: Appartement
          - generic [ref=e48]:
            - heading "Appartement moderne - Vue sur mer" [level=3] [ref=e49]
            - generic [ref=e50]:
              - img [ref=e51]
              - text: Almadies, Dakar
            - generic [ref=e54]:
              - generic [ref=e55]:
                - img [ref=e56]
                - text: "3"
              - generic [ref=e61]:
                - img [ref=e62]
                - text: "2"
              - generic [ref=e68]:
                - img [ref=e69]
                - text: 110 m²
            - generic [ref=e72]:
              - generic [ref=e73]: 450 000 FCFA
              - generic [ref=e74]: /mois
        - generic [ref=e75] [cursor=pointer]:
          - generic [ref=e76]:
            - img "Studio meublé centre-ville" [ref=e77]
            - generic:
              - generic: Disponible
              - generic: Studio
          - generic [ref=e78]:
            - heading "Studio meublé centre-ville" [level=3] [ref=e79]
            - generic [ref=e80]:
              - img [ref=e81]
              - text: Plateau, Dakar
            - generic [ref=e84]:
              - generic [ref=e85]:
                - img [ref=e86]
                - text: "1"
              - generic [ref=e91]:
                - img [ref=e92]
                - text: "1"
              - generic [ref=e98]:
                - img [ref=e99]
                - text: 35 m²
            - generic [ref=e102]:
              - generic [ref=e103]: 200 000 FCFA
              - generic [ref=e104]: /mois
        - generic [ref=e105] [cursor=pointer]:
          - generic [ref=e106]:
            - img "Villa 4 chambres avec jardin" [ref=e107]
            - generic:
              - generic: Réservé
              - generic: Villa
          - generic [ref=e108]:
            - heading "Villa 4 chambres avec jardin" [level=3] [ref=e109]
            - generic [ref=e110]:
              - img [ref=e111]
              - text: Ngor, Dakar
            - generic [ref=e114]:
              - generic [ref=e115]:
                - img [ref=e116]
                - text: "4"
              - generic [ref=e121]:
                - img [ref=e122]
                - text: "3"
              - generic [ref=e128]:
                - img [ref=e129]
                - text: 220 m²
            - generic [ref=e132]:
              - generic [ref=e133]: 850 000 FCFA
              - generic [ref=e134]: /mois
        - generic [ref=e135] [cursor=pointer]:
          - generic [ref=e136]:
            - img "Chambre étudiante" [ref=e137]
            - generic:
              - generic: Disponible
              - generic: Chambre
          - generic [ref=e138]:
            - heading "Chambre étudiante" [level=3] [ref=e139]
            - generic [ref=e140]:
              - img [ref=e141]
              - text: Mermoz, Dakar
            - generic [ref=e144]:
              - generic [ref=e145]:
                - img [ref=e146]
                - text: "1"
              - generic [ref=e151]:
                - img [ref=e152]
                - text: "1"
              - generic [ref=e158]:
                - img [ref=e159]
                - text: 18 m²
            - generic [ref=e162]:
              - generic [ref=e163]: 90 000 FCFA
              - generic [ref=e164]: /mois
        - generic [ref=e165] [cursor=pointer]:
          - generic [ref=e166]:
            - img "Appartement familial" [ref=e167]
            - generic:
              - generic: Loué
              - generic: Appartement
          - generic [ref=e168]:
            - heading "Appartement familial" [level=3] [ref=e169]
            - generic [ref=e170]:
              - img [ref=e171]
              - text: Sacré-Cœur, Dakar
            - generic [ref=e174]:
              - generic [ref=e175]:
                - img [ref=e176]
                - text: "3"
              - generic [ref=e181]:
                - img [ref=e182]
                - text: "2"
              - generic [ref=e188]:
                - img [ref=e189]
                - text: 95 m²
            - generic [ref=e192]:
              - generic [ref=e193]: 350 000 FCFA
              - generic [ref=e194]: /mois
        - generic [ref=e195] [cursor=pointer]:
          - generic [ref=e196]:
            - img "Studio moderne avec balcon" [ref=e197]
            - generic:
              - generic: Disponible
              - generic: Studio
          - generic [ref=e198]:
            - heading "Studio moderne avec balcon" [level=3] [ref=e199]
            - generic [ref=e200]:
              - img [ref=e201]
              - text: Point E, Dakar
            - generic [ref=e204]:
              - generic [ref=e205]:
                - img [ref=e206]
                - text: "1"
              - generic [ref=e211]:
                - img [ref=e212]
                - text: "1"
              - generic [ref=e218]:
                - img [ref=e219]
                - text: 40 m²
            - generic [ref=e222]:
              - generic [ref=e223]: 180 000 FCFA
              - generic [ref=e224]: /mois
        - generic [ref=e225] [cursor=pointer]:
          - generic [ref=e226]:
            - img "Appartement 2 pièces" [ref=e227]
            - generic:
              - generic: Disponible
              - generic: Appartement
          - generic [ref=e228]:
            - heading "Appartement 2 pièces" [level=3] [ref=e229]
            - generic [ref=e230]:
              - img [ref=e231]
              - text: Yoff, Dakar
            - generic [ref=e234]:
              - generic [ref=e235]:
                - img [ref=e236]
                - text: "2"
              - generic [ref=e241]:
                - img [ref=e242]
                - text: "1"
              - generic [ref=e248]:
                - img [ref=e249]
                - text: 65 m²
            - generic [ref=e252]:
              - generic [ref=e253]: 220 000 FCFA
              - generic [ref=e254]: /mois
        - generic [ref=e255] [cursor=pointer]:
          - generic [ref=e256]:
            - img "Chambre en colocation" [ref=e257]
            - generic:
              - generic: Disponible
              - generic: Chambre
          - generic [ref=e258]:
            - heading "Chambre en colocation" [level=3] [ref=e259]
            - generic [ref=e260]:
              - img [ref=e261]
              - text: Fann, Dakar
            - generic [ref=e264]:
              - generic [ref=e265]:
                - img [ref=e266]
                - text: "1"
              - generic [ref=e271]:
                - img [ref=e272]
                - text: "1"
              - generic [ref=e278]:
                - img [ref=e279]
                - text: 22 m²
            - generic [ref=e282]:
              - generic [ref=e283]: 110 000 FCFA
              - generic [ref=e284]: /mois
  - generic [ref=e285]:
    - generic "Toggle devtools panel" [ref=e286] [cursor=pointer]:
      - img [ref=e287]
    - generic "Toggle Component Inspector" [ref=e292] [cursor=pointer]:
      - img [ref=e293]
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