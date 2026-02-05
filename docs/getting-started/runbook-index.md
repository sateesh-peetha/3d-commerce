# Runbook Index

> **Audience**: Operators, on-call engineers

Quick reference to all operational runbooks for incident response.

## Critical Runbooks

| Runbook | Symptoms | Severity |
|---------|----------|----------|
| [System Down](#system-down) | All services unreachable | P1 |
| [Payment Failures](#payment-failures) | Checkout failing | P1 |
| [Security Alert](#security-alert) | Suspicious activity | P1 |

## High Priority

| Runbook | Symptoms | Severity |
|---------|----------|----------|
| [Upload Failures](#upload-failures) | 3D model uploads failing | P2 |
| [AI Outage](#ai-outage) | Layout suggestions not working | P2 |
| [Plugin Crash](#plugin-crash) | Plugin errors/crashes | P2 |

---

## System Down

### Symptoms
- HTTP 5xx errors
- Health check failing
- Users cannot access site

### Immediate Actions

1. **Check infrastructure status**
   ```bash
   firebase functions:list
   gcloud app services list
   ```

2. **Check error logs**
   ```bash
   firebase functions:log --only api
   ```

3. **Verify database connectivity**
   ```bash
   curl https://api.example.com/health
   ```

### Escalation
- If unresolved in 15 min → Page engineering lead
- If unresolved in 30 min → Page on-call manager

### Recovery Verification
- [ ] Health endpoint returns 200
- [ ] Home page loads
- [ ] Login works
- [ ] Product list displays
- [ ] Cart operations work

---

## Payment Failures

### Symptoms
- Checkout button errors
- Payment not processing
- Orders not created

### Immediate Actions

1. **Check Stripe Dashboard**
   - Login to Stripe
   - Check for incidents
   - Review failed payments

2. **Verify webhook status**
   ```bash
   curl -X POST https://api.example.com/webhooks/stripe \
     -H "Stripe-Signature: test"
   # Should return 400 (signature invalid), not 500
   ```

3. **Check API keys**
   - Verify STRIPE_SECRET_KEY is set
   - Verify not expired

### Escalation
- Stripe incident → Monitor Stripe status page
- Our issue → Page payment team lead

### Recovery Verification
- [ ] Test checkout with test card
- [ ] Webhook receives events
- [ ] Order created in database
- [ ] Email confirmation sent

---

## Upload Failures

### Symptoms
- 3D model uploads fail
- Upload progress stuck
- Storage errors

### Immediate Actions

1. **Check Cloud Storage**
   ```bash
   gsutil ls gs://your-bucket/
   ```

2. **Verify storage quotas**
   - Check Firebase Console → Storage
   - Review usage limits

3. **Check file size limits**
   - Max file size: 100MB
   - Allowed formats: STL, OBJ, 3MF

### Escalation
- If storage full → Alert admin for cleanup
- If permission issue → Check IAM roles

### Recovery Verification
- [ ] Test upload small file
- [ ] Test upload max size file
- [ ] Verify file accessible after upload

---

## AI Outage

### Symptoms
- Layout suggestions not appearing
- AI responses timing out
- Cost limit errors

### Immediate Actions

1. **Check AI service status**
   - Review Gemini API status
   - Check error logs for API responses

2. **Verify budget**
   ```bash
   # Check remaining budget
   curl https://api.example.com/admin/ai/budget
   ```

3. **Check rate limits**
   - Review requests per minute
   - Identify spike in usage

### Escalation
- Google API issue → Monitor Google status
- Budget exceeded → Request budget increase

### Recovery Verification
- [ ] Test layout suggestion
- [ ] Verify cost tracking
- [ ] Check API responds

---

## Plugin Crash

### Symptoms
- Plugin UI not rendering
- Plugin errors in console
- Plugin state: "error"

### Immediate Actions

1. **Identify failing plugin**
   ```bash
   curl https://api.example.com/admin/plugins/status
   ```

2. **Disable problematic plugin**
   ```bash
   curl -X POST https://api.example.com/admin/plugins/{id}/disable
   ```

3. **Check plugin logs**
   - Review error messages
   - Check resource usage

### Escalation
- Core plugin → Page engineering
- Third-party → Contact plugin vendor

### Recovery Verification
- [ ] Core site works without plugin
- [ ] Re-enable plugin (if fixed)
- [ ] Plugin functionality verified

---

## Security Alert

### Symptoms
- Abnormal login patterns
- Suspicious API activity
- Audit log alerts

### Immediate Actions

1. **Assess threat level**
   - Review audit logs
   - Check affected accounts

2. **Contain if needed**
   ```bash
   # Block suspicious IP
   # Revoke compromised sessions
   # Disable affected accounts
   ```

3. **Preserve evidence**
   - Export relevant logs
   - Screenshot anomalies

### Escalation
- Confirmed breach → Immediately page security team
- Potential breach → Alert within 1 hour

### Recovery Verification
- [ ] Threat contained
- [ ] Affected accounts secured
- [ ] Incident documented
- [ ] Post-mortem scheduled

---

## General Recovery Checklist

After any incident:

1. [ ] Root cause identified
2. [ ] Fix deployed
3. [ ] All verification checks pass
4. [ ] Monitoring shows normal
5. [ ] Incident documented
6. [ ] Post-mortem scheduled (if needed)

## Contact List

| Role | Contact |
|------|---------|
| On-call engineer | Check PagerDuty |
| Engineering lead | See internal wiki |
| Security team | security@example.com |
| Stripe support | Stripe dashboard |
