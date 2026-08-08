import { test } from '@playwright/test'

test('should not be able to accesss the account page without logging in', async ({ page }) => {
  await page.goto('/')
})

test('should be able to access and modify their account details after logging in', async ({ page }) => {
  await page.goto('/')
})

test('should be able to view their order history after logging in', async ({ page }) => {
  await page.goto('/')
})
