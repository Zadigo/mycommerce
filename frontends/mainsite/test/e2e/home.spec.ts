import { expect, test } from '@playwright/test'

test.skip('should contain new session data in the cookies, local storage and/or session storage', async ({ page }) => {
  await page.goto('/')

  // Check if the session ID cookie is set
  await page.evaluate(() => {
    const tokens = document.cookie.split('; ')
    console.log(document.cookie)
    const sessionIdCookie = tokens.find(cookie => cookie.startsWith('sessionId='))
    const cartSessionIdCookie = tokens.find(cookie => cookie.startsWith('cart-session='))

    expect(cartSessionIdCookie).toBeDefined()
    expect(sessionIdCookie).toBeDefined()
  })
})

test('should be able to access a collection of products', async ({ page }) => {
  await page.goto('/')

  // Go to collection page
  const link = page.getByRole('link', { name: 'Summer Collection Seasonal' })
  await link.waitFor({ state: 'visible' })
  await link.click()
  
  // Feed
  let feed: Element | null = null 

  await page.evaluate(() => {
    feed = document.querySelector('div#products')
  })

  expect(feed).toBeDefined()
  console.log(feed)
  
  expect(page.url()).toContain('/shop/collection/')
  expect(page.getByRole('heading', { name: 'summer-collection' })).toBeVisible()
})

test('should be able to search for products', async ({ page }) => {
  await page.goto('/')

  const locator = page.getByRole('button', { name: /[sS]earch/ })
  expect(locator).toBeVisible()
  expect(locator).toBeEnabled()


  const link = page.getByRole('link', { name: 'Summer Collection Seasonal' })
  await link.waitFor({ state: 'visible' })
  await locator.click({ delay: 300 })

  const input = page.getByPlaceholder(/Ecris les produits à rechercher/)
  
  expect(input).toBeVisible()

  await input.click()
  await input.fill('jupe rouge')
})

test(('should be able to login to their account'), async ({ page }) => {
  await page.goto('/')
})

test('should be able to check the products in their cart', async ({ page }) => {
  await page.goto('/')
})
