import { test } from '@playwright/test'

test('should be able to filter the products on the the page', async ({ page }) => {
  await page.goto('/')
})

test(('should be able to add a product to the his cart directly from the products collection page'), async ({ page }) => {
  await page.goto('/')
})

