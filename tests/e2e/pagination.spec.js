import { test, expect } from '@playwright/test'

test('Catalogue envoie page et size au chargement', async ({ page }) => {
  // Wait for the catalogue page to load and the API call to occur.
  const requestPromise = page.waitForRequest(
    (req) => req.url().includes('/biens/publics') && req.method() === 'GET',
    { timeout: 15000 },
  )

  await page.goto('/catalogue')
  const request = await requestPromise

  const url = new URL(request.url())
  expect(url.searchParams.get('page')).toBe('1')
  expect(url.searchParams.get('size')).toBe('20')
})
