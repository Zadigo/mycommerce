import { test } from '@playwright/test'

test('should contain new session data in the cookies, local storage and/or session storage', async ({ page }) => {
  await page.goto('/')
})

test('should be able to access a collection of products', async ({ page }) => {
  await page.goto('/')
})

test('should be able to search for products', async ({ page }) => {
  await page.goto('/')
})

test(('should be able to login to their account'), async ({ page }) => {
  await page.goto('/')
})

test('should be able to check the products in their cart', async ({ page }) => {
  await page.goto('/')
})
