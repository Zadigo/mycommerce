import { test } from '@playwright/test'

test('should be able to check the products in their cart via the modal component', async ({ page }) => {
  await page.goto('/')
})

test('should be able to go the cart page and check the products in their cart', async ({ page }) => {
  await page.goto('/')
})

test('should be able to complete the checkout process and place an order', async ({ page }) => {
  await page.goto('/')
})

test('should run the customer journey workflow starting from the home page', async ({ page }) => {
  await page.goto('/')
})

test('should be able to add a product, update the product quantity details, remove a product', async ({ page }) => {
  await page.goto('/')
})

test('should be able to cancel an order', async ({ page }) => {
  await page.goto('/')
})

test('should be able to view the order details of a placed order', async ({ page }) => {
  await page.goto('/')
})

