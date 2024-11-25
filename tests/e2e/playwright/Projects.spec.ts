// tests/project_detail_page.spec.ts

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Projects e2e tests', () => {

    test('should load project details', async ({ page }) => {
        await page.goto('/');
        await page.click('button:has-text("Login")');
        await page.fill('input#username', process.env.USER_TEST_EMAIL);
        await page.fill('input#password', process.env.USER_TEST_PASSWORD);

        await page.click('button:has-text("Continue")');
        await expect(page.locator('text=MainApp')).toBeVisible(); 
        await expect(page.locator('text=Projects')).toBeVisible(); 

        await page.getByRole('button', { name: 'Projects' }).click();
        await expect(page.locator('text=Demo Project')).toBeVisible();
        await expect(page.locator('text=A demonstration project')).toBeVisible();

        const row = await page.locator('table[aria-label="table"] tr', {
            has: page.locator('td', { hasText: 'Demo Project' })
          });

        await row.locator('button[aria-label="view"]').click();
        await expect(page.locator('text=Project Details')).toBeVisible();
        await expect(page.locator('text=Demo Project')).toBeVisible();
    });

});
