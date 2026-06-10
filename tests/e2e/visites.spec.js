import { test, expect } from '@playwright/test'

test('Visites page affiche le titre', async ({ page }) => {
  // Navigate to the app first to ensure same-origin, then inject auth
  // Ensure the mock auth is present before any navigation to avoid same-origin/security issues
  await page.context().addInitScript(() => {
    window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.TOKEN')
    window.sessionStorage.setItem('nekaso_user', JSON.stringify({ id: 1, role: 'GESTIONNAIRE' }))
  })
  await page.goto('/gestionnaire/visites')
  const titre = page.locator('h2.visites-titre')
  await expect(titre).toHaveText('Demandes de visites')
})
