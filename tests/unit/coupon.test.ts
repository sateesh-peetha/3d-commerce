// Coupon validation unit tests
// Commerce Bundle - Test Generation Agent

import { describe, it, expect } from 'vitest';

interface Coupon {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minPurchase: number;
    maxDiscount?: number;
    validUntil: Date;
    usageLimit: number;
    usageCount: number;
}

function validateCoupon(
    coupon: Coupon | null,
    cartTotal: number
): { valid: boolean; discount: number; message: string } {
    if (!coupon) {
        return { valid: false, discount: 0, message: 'Invalid coupon code' };
    }

    if (coupon.validUntil < new Date()) {
        return { valid: false, discount: 0, message: 'Coupon has expired' };
    }

    if (coupon.usageCount >= coupon.usageLimit) {
        return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
    }

    if (cartTotal < coupon.minPurchase) {
        return {
            valid: false,
            discount: 0,
            message: `Minimum purchase of $${coupon.minPurchase} required`
        };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
        discount = cartTotal * (coupon.value / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }
    } else {
        discount = coupon.value;
    }

    // Never exceed cart total
    if (discount > cartTotal) {
        discount = cartTotal;
    }

    return {
        valid: true,
        discount: Math.round(discount * 100) / 100,
        message: 'Coupon applied successfully'
    };
}

describe('Coupon Validation', () => {
    const validPercentCoupon: Coupon = {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        minPurchase: 20,
        maxDiscount: 50,
        validUntil: new Date('2030-12-31'),
        usageLimit: 100,
        usageCount: 0
    };

    const validFixedCoupon: Coupon = {
        code: 'FLAT5',
        type: 'fixed',
        value: 5,
        minPurchase: 10,
        validUntil: new Date('2030-12-31'),
        usageLimit: 100,
        usageCount: 0
    };

    it('validates percentage coupon correctly', () => {
        const result = validateCoupon(validPercentCoupon, 100);
        expect(result.valid).toBe(true);
        expect(result.discount).toBe(10); // 10% of 100
    });

    it('validates fixed coupon correctly', () => {
        const result = validateCoupon(validFixedCoupon, 50);
        expect(result.valid).toBe(true);
        expect(result.discount).toBe(5);
    });

    it('rejects null/invalid coupon', () => {
        const result = validateCoupon(null, 100);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Invalid coupon code');
    });

    it('rejects expired coupon', () => {
        const expiredCoupon = { ...validPercentCoupon, validUntil: new Date('2020-01-01') };
        const result = validateCoupon(expiredCoupon, 100);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Coupon has expired');
    });

    it('rejects coupon when usage limit reached', () => {
        const usedCoupon = { ...validPercentCoupon, usageCount: 100 };
        const result = validateCoupon(usedCoupon, 100);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Coupon usage limit reached');
    });

    it('rejects coupon when cart below minimum', () => {
        const result = validateCoupon(validPercentCoupon, 15);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('Minimum purchase');
    });

    it('caps percentage discount at maxDiscount', () => {
        const result = validateCoupon(validPercentCoupon, 1000);
        expect(result.discount).toBe(50); // capped at maxDiscount
    });

    it('never exceeds cart total', () => {
        const bigFixedCoupon = { ...validFixedCoupon, value: 100, minPurchase: 0 };
        const result = validateCoupon(bigFixedCoupon, 30);
        expect(result.discount).toBe(30); // capped at cart total
    });
});
