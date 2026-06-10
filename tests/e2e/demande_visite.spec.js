import { test, expect } from '@playwright/test'

test('Flow demander visite (pendingAction -> login -> confirmer) envoie payload minimal', async ({
  page,
}) => {
  const bienId = 42
  // Intercept POST and return success
  let captured = null
  await page.route('**/visites/demander', async (route) => {
    const req = route.request()
    const postData = req.postData() || ''
    try {
      captured = JSON.parse(postData)
    } catch (e) {}
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 101, statut: 'EN_ATTENTE' }),
    })
  })

  // Start at bien detail (not authenticated)
  await page.goto(`/biens/${bienId}`)
  await page.click('button:has-text("Demander une visite")')

  // Redirects to login
  await page.waitForURL('**/login')

  // Inject mock auth before navigating back so pendingAction is processed automatically
  await page.context().addInitScript(() => {
    window.sessionStorage.setItem('nekaso_token', 'MOCK.JWT.TOKEN')
    window.sessionStorage.setItem('nekaso_user', JSON.stringify({ id: 2, role: 'LOCATAIRE' }))
  })
  await page.goto(`/biens/${bienId}`)

  // Modal should appear
  await page.waitForSelector('div.modal')
  // Confirm the request
  await Promise.all([
    page.waitForURL(`**/locataire/succes-visite/${bienId}`),
    page.click('div.modal button:has-text("Confirmer")'),
  ])

  expect(captured).toEqual({ idBien: bienId, idLocataire: 2 })
})
