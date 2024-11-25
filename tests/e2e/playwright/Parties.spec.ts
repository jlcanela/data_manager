// tests/project_detail_page.spec.ts

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Parties e2e test', () => {

    test('should view party details', async ({ page }) => {
        await page.goto('/');
        await page.click('button:has-text("Login")');
        await page.fill('input#username', process.env.USER_TEST_EMAIL);
        await page.fill('input#password', process.env.USER_TEST_PASSWORD);

        await page.click('button:has-text("Continue")');
        await expect(page.locator('text=MainApp')).toBeVisible(); 
        await expect(page.locator('text=Parties')).toBeVisible(); 

        await page.getByRole('button', { name: 'Parties' }).click();
        await expect(page.locator('text=Jean-Luc')).toBeVisible();

        const row = await page.locator('table[aria-label="table"] tr', {
            has: page.locator('td', { hasText: 'Jean-Luc' })
          });

        await row.locator('button[aria-label="view"]').click();
        await expect(page.locator('text=Party Details')).toBeVisible();
        await expect(page.getByText(/Jean-Luc/)).toBeVisible();
    });

});
