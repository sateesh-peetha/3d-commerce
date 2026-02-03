// 3D Printing Ops Bundle E2E Tests
// Test Generation Agent Output

import { test, expect } from '@playwright/test';

test.describe('Bundle: 3D Printing Ops - File Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'customer@example.com');
        await page.fill('[data-testid="password"]', 'password');
        await page.click('[data-testid="login-btn"]');
    });

    test('User can view uploaded files', async ({ page }) => {
        await page.goto('/files');
        await expect(page.locator('[data-testid="file-grid"]')).toBeVisible();
    });

    test('User can mark file as favorite', async ({ page }) => {
        await page.goto('/files');

        const firstFile = page.locator('[data-testid="file-card"]').first();
        await firstFile.locator('[data-testid="favorite-btn"]').click();

        await expect(firstFile.locator('[data-testid="favorite-icon"]')).toHaveClass(/active/);
    });

    test('User can delete own file', async ({ page }) => {
        await page.goto('/files');

        const initialCount = await page.locator('[data-testid="file-card"]').count();
        await page.locator('[data-testid="file-card"]').first().locator('[data-testid="delete-btn"]').click();
        await page.click('[data-testid="confirm-delete"]');

        await expect(page.locator('[data-testid="file-card"]')).toHaveCount(initialCount - 1);
    });
});

test.describe('Bundle: 3D Printing Ops - Print Presets', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'customer@example.com');
        await page.fill('[data-testid="password"]', 'password');
        await page.click('[data-testid="login-btn"]');
    });

    test('User can create print preset', async ({ page }) => {
        await page.goto('/presets');

        await page.click('[data-testid="new-preset"]');
        await page.fill('[data-testid="preset-name"]', 'My Custom Preset');
        await page.selectOption('[data-testid="quality"]', 'high');
        await page.fill('[data-testid="infill"]', '50');
        await page.click('[data-testid="save-preset"]');

        await expect(page.locator('[data-testid="preset-item"]')).toContainText('My Custom Preset');
    });

    test('User can set default preset', async ({ page }) => {
        await page.goto('/presets');

        await page.locator('[data-testid="preset-item"]').first().locator('[data-testid="set-default"]').click();
        await expect(page.locator('[data-testid="preset-item"]').first()).toHaveClass(/default/);
    });

    test('User can reorder from file history', async ({ page }) => {
        await page.goto('/files');

        await page.locator('[data-testid="file-card"]').first().locator('[data-testid="reorder-btn"]').click();
        await page.waitForURL('/upload?file=*');

        await expect(page.locator('[data-testid="model-viewer"]')).toBeVisible();
    });
});

test.describe('Bundle: 3D Printing Ops - Order Workflow', () => {
    test('User can track order status', async ({ page }) => {
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'customer@example.com');
        await page.fill('[data-testid="password"]', 'password');
        await page.click('[data-testid="login-btn"]');

        await page.goto('/orders');
        await page.locator('[data-testid="order-card"]').first().click();
        await page.waitForURL('/orders/**/track');

        await expect(page.locator('[data-testid="order-timeline"]')).toBeVisible();
    });

    test('Admin can advance order state', async ({ page }) => {
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'admin@example.com');
        await page.fill('[data-testid="password"]', 'adminpassword');
        await page.click('[data-testid="login-btn"]');

        await page.goto('/admin/orders');
        await page.locator('[data-testid="order-row"]').first().click();

        await page.click('[data-testid="transition-btn"]');
        await page.selectOption('[data-testid="new-status"]', 'processing');
        await page.click('[data-testid="confirm-transition"]');

        await expect(page.locator('[data-testid="order-status"]')).toContainText('processing');
    });
});
