import { test, expect } from '@playwright/test'

test('Flow demander location envoie payload minimal', async ({ page }) => {
  const bienId = 55
  let captured = null
  await page.route('**/demandes-location/creer', async (route) => {
    const req = route.request()
    const postData = req.postData() || ''
    try {
      captured = JSON.parse(postData)
    } catch (e) {}
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 202, statut: 'EN_ATTENTE' }),
    })
  })

  await page.goto(`/biens/${bienId}`)
  await page.click('button:has-text("Demander une location")')
  await page.waitForURL('**/login')

  // Inject mock auth before navigating back so pendingAction is processed automatically
  await page.context().addInitScript(() => {
    window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.TOKEN')
    window.sessionStorage.setItem('nekaso_user', JSON.stringify({ id: 2, role: 'LOCATAIRE' }))
  })
  await page.goto(`/biens/${bienId}`)

  await page.waitForSelector('div.modal')
  await Promise.all([
    page.waitForURL(`**/locataire/succes-location/${bienId}`),
    page.click('div.modal button:has-text("Confirmer")'),
  ])

  expect(captured).toEqual({ idBien: bienId, idLocataire: 2 })
})
