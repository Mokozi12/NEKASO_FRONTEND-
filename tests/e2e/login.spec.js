import { test, expect } from '@playwright/test'

test.describe('Authentification', () => {
  test('Connexion locataire redirige vers /locataire/mes-locations', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[placeholder="77 123 45 67"]', '770000000')
    await page.fill('input[type="password"]', 'test')
    await Promise.all([
      page.waitForURL('**/locataire/mes-locations', { timeout: 5000 }),
      page.click('button:has-text("Se connecter")'),
    ])
    // token stored in sessionStorage
    const token = await page.evaluate(() => sessionStorage.getItem('nekaso_token'))
    expect(token).toBeTruthy()
  })

  test('Connexion gestionnaire redirige vers /gestionnaire/dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[placeholder="77 123 45 67"]', '771234567')
    await page.fill('input[type="password"]', 'test')
    await Promise.all([
      page.waitForURL('**/gestionnaire/dashboard', { timeout: 5000 }),
      page.click('button:has-text("Se connecter")'),
    ])
    const token = await page.evaluate(() => sessionStorage.getItem('nekaso_token'))
    expect(token).toBeTruthy()
  })
})
