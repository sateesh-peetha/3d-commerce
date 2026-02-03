// Admin Platform Bundle E2E Tests

import { test, expect } from '@playwright/test';

test.describe('Bundle: Admin Platform - User Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'admin@example.com');
        await page.fill('[data-testid="password"]', 'adminpassword');
        await page.click('[data-testid="login-btn"]');
    });

    test('Admin can view all users', async ({ page }) => {
        await page.goto('/admin/users');
        await expect(page.locator('[data-testid="user-table"]')).toBeVisible();
        await expect(page.locator('[data-testid="user-row"]')).toHaveCount({ min: 1 });
    });

    test('Admin can search users', async ({ page }) => {
        await page.goto('/admin/users');
        await page.fill('[data-testid="search-input"]', 'customer@');
        await page.click('[data-testid="search-btn"]');
        await page.waitForLoadState('networkidle');
    });

    test('Admin can filter users by role', async ({ page }) => {
        await page.goto('/admin/users');
        await page.selectOption('[data-testid="role-filter"]', 'admin');
        await page.waitForLoadState('networkidle');
    });

    test('Admin can disable user', async ({ page }) => {
        await page.goto('/admin/users');
        await page.locator('[data-testid="user-row"]').first().locator('[data-testid="disable-btn"]').click();
        await page.click('[data-testid="confirm-disable"]');
        await expect(page.locator('[data-testid="user-row"]').first()).toContainText('disabled');
    });
});

test.describe('Bundle: Admin Platform - API Keys', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'admin@example.com');
        await page.fill('[data-testid="password"]', 'adminpassword');
        await page.click('[data-testid="login-btn"]');
    });

    test('Admin can view API keys by provider', async ({ page }) => {
        await page.goto('/admin/settings/api-keys');
        await page.click('[data-testid="tab-stripe"]');
        await expect(page.locator('[data-testid="api-key-list"]')).toBeVisible();
    });

    test('Admin can rotate API key', async ({ page }) => {
        await page.goto('/admin/settings/api-keys');
        await page.locator('[data-testid="api-key-row"]').first().locator('[data-testid="rotate-btn"]').click();
        await page.click('[data-testid="confirm-rotate"]');
        await expect(page.locator('[data-testid="new-key-value"]')).toBeVisible();
    });
});

test.describe('Bundle: Admin Platform - Audit Logs', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'admin@example.com');
        await page.fill('[data-testid="password"]', 'adminpassword');
        await page.click('[data-testid="login-btn"]');
    });

    test('Admin can view audit logs', async ({ page }) => {
        await page.goto('/admin/audit');
        await expect(page.locator('[data-testid="audit-log-table"]')).toBeVisible();
    });

    test('Admin can filter audit logs by action', async ({ page }) => {
        await page.goto('/admin/audit');
        await page.selectOption('[data-testid="action-filter"]', 'user.login');
        await page.waitForLoadState('networkidle');
    });
});
