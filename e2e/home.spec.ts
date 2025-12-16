import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the header', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })
})