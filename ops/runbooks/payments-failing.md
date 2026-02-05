# Payments Failing Runbook

## Symptoms
- Payment failure rate > 10%
- Users reporting checkout failures
- Stripe webhook failures in logs
- Order success rate declining
- Alert: PAY001 triggered

## Immediate Actions (First 5 Minutes)

### 1. Check Stripe Status
- Visit [Stripe Status](https://status.stripe.com/)
- Check for any ongoing incidents

### 2. Check Webhook Health
```bash
# Check recent webhook logs
gcloud logging read "jsonPayload.category=payment" --limit=50

# Look for patterns:
# - Signature verification failures
# - Timeout errors
# - 5xx responses
```

### 3. Verify Stripe Credentials
- Confirm API keys are valid in Firebase environment
- Check if keys were recently rotated

### 4. Check for Recent Deploys
- Was there a deployment in the last hour?
- Any changes to payment code?

## Quick Fixes

### If Webhooks are Failing
1. Check webhook endpoint URL in Stripe Dashboard
2. Verify webhook signing secret matches
3. Check if our endpoint is responding

### If API Calls Failing
1. Verify STRIPE_SECRET_KEY environment variable
2. Check for rate limiting from Stripe
3. Verify account is in good standing

### If Idempotency Issues
1. Check for duplicate payment attempts
2. Review idempotency key generation

## Escalation Steps

### If payments still failing > 10 minutes:
1. **Disable checkout temporarily**
   - Show "Checkout temporarily unavailable" message
   - This prevents user frustration and wasted attempts

2. Page payment system owner

### If Stripe outage confirmed:
1. Update status page
2. Queue pending orders for retry
3. Prepare customer communication

### If our error requires code fix:
1. Prepare hotfix
2. Test in staging
3. Fast-track deployment

## Recovery Verification

After issue resolved:

- [ ] Test payment in staging: successful
- [ ] Test payment in production (small amount): successful
- [ ] Webhook test from Stripe: received and processed
- [ ] Payment failure rate returned to baseline
- [ ] No duplicate charges created
- [ ] Retry queued payments

## Do NOT Do

- Do NOT retry failed payments automatically without checking for duplicates
- Do NOT hardcode credentials as a "quick fix"
- Do NOT disable webhook signature verification

## Post-Incident

1. Reconcile all affected orders
2. Check for any duplicate charges
3. Communicate with affected customers if needed
4. Document root cause

---
**Last Updated:** 2026-02-05
**Owner:** Payments Team
