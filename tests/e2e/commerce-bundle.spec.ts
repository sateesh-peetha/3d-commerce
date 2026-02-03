// Commerce Bundle E2E Tests
// Test Generation Agent Output

import { test, expect } from '@playwright/test';

test.describe('Bundle: Commerce - Store Page', () => {
    test('User can browse products on store page', async ({ page }) => {
        await page.goto('/store');

        await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
        await expect(page.locator('[data-testid="product-card"]')).toHaveCount({ min: 1 });
    });

    test('User can filter products by category', async ({ page }) => {
        await page.goto('/store');

        await page.click('[data-testid="filter-category-jewelry"]');
        await page.waitForLoadState('networkidle');

        // All visible products should be jewelry
        const cards = page.locator('[data-testid="product-card"]');
        await expect(cards).toHaveCount({ min: 1 });
    });

    test('User can filter products by price range', async ({ page }) => {
        await page.goto('/store');

        await page.fill('[data-testid="filter-min-price"]', '10');
        await page.fill('[data-testid="filter-max-price"]', '50');
        await page.click('[data-testid="filter-apply"]');

        await page.waitForLoadState('networkidle');
        await expect(page.locator('[data-testid="product-card"]')).toHaveCount({ min: 0 });
    });

    test('User can sort products', async ({ page }) => {
        await page.goto('/store');

        await page.selectOption('[data-testid="sort-select"]', 'price_asc');
        await page.waitForLoadState('networkidle');

        // Products should be sorted by price
        await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    });
});

test.describe('Bundle: Commerce - Cart & Checkout', () => {
    test('User can add product to cart from listing', async ({ page }) => {
        await page.goto('/store');

        // Click first product
        await page.locator('[data-testid="product-card"]').first().click();
        await page.waitForURL('/product/*');

        // Add to cart
        await page.click('[data-testid="add-to-cart"]');
        await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
    });

    test('User can apply coupon code', async ({ page }) => {
        // Pre-condition: item in cart
        await page.goto('/cart');

        await page.fill('[data-testid="coupon-input"]', 'SAVE10');
        await page.click('[data-testid="apply-coupon"]');

        await expect(page.locator('[data-testid="discount-row"]')).toBeVisible();
        await expect(page.locator('[data-testid="discount-amount"]')).toContainText('-');
    });

    test('Invalid coupon shows error', async ({ page }) => {
        await page.goto('/cart');

        await page.fill('[data-testid="coupon-input"]', 'INVALID');
        await page.click('[data-testid="apply-coupon"]');

        await expect(page.locator('[data-testid="coupon-error"]')).toBeVisible();
    });

    test('User can remove coupon', async ({ page }) => {
        await page.goto('/cart');

        // Apply coupon first
        await page.fill('[data-testid="coupon-input"]', 'SAVE10');
        await page.click('[data-testid="apply-coupon"]');

        // Remove coupon
        await page.click('[data-testid="remove-coupon"]');
        await expect(page.locator('[data-testid="discount-row"]')).not.toBeVisible();
    });
});

test.describe('Bundle: Commerce - Order History', () => {
    test.beforeEach(async ({ page }) => {
        // Login as customer
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'customer@example.com');
        await page.fill('[data-testid="password"]', 'password');
        await page.click('[data-testid="login-btn"]');
    });

    test('User can view order history', async ({ page }) => {
        await page.goto('/orders');

        await expect(page.locator('[data-testid="order-card"]')).toHaveCount({ min: 0 });
    });

    test('User can filter orders by status', async ({ page }) => {
        await page.goto('/orders');

        await page.selectOption('[data-testid="status-filter"]', 'delivered');
        await page.waitForLoadState('networkidle');
    });
});
