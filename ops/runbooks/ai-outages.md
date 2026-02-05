# AI Outages Runbook

## Symptoms
- AI health check failing
- AI feature requests timing out
- "AI unavailable" messages to users
- AI call success rate < 50%
- AI cost alerts triggering
- Alert: AI001 or AI002 triggered

## Immediate Actions (First 5 Minutes)

### 1. Check AI Provider Status
- [Google AI Status](https://status.cloud.google.com/)
- [OpenAI Status](https://status.openai.com/)

### 2. Check AI Health Endpoint
```bash
curl https://api.3dcommerce.example.com/api/health/ai
```

### 3. Check Recent AI Logs
```bash
gcloud logging read 'jsonPayload.category="ai"' --limit=50

# Look for:
# - Rate limit errors
# - Authentication failures
# - Timeout errors
# - Invalid request errors
```

### 4. Verify AI Feature Degradation is Active
- Check that AI features show "temporarily unavailable"
- Confirm core features still work

## Diagnostic Checks

### API Key Issues
```bash
# Check if API key is set
# Check if key was recently rotated
# Check key quotas in provider dashboard
```

### Rate Limiting
```bash
# Check if we've exceeded quota
# Check daily usage vs limits
# Check requests per minute
```

### Network Issues
```bash
# Can we reach AI API endpoints?
# Are there firewall changes?
# DNS resolution working?
```

## Scenario-Specific Actions

### All Providers Down
1. Confirm with status pages
2. Graceful degradation should be active
3. Wait for provider recovery
4. No action needed unless extended outage

### Single Provider Down (Others Available)
1. Verify failover to backup provider
2. Monitor backup provider usage
3. Alert if backup approaching limits

### Rate Limit Exceeded
1. Check what caused spike in usage
2. Reduce concurrency temporarily
3. Consider requesting quota increase

### API Key Invalid/Expired
1. Regenerate API key in provider console
2. Update in Firebase environment config
3. Redeploy functions

### Cost Limit Approaching
1. Review recent AI usage patterns
2. Check for runaway processes
3. Consider temporarily reducing AI features
4. Increase limit if legitimate usage

## Graceful Degradation Checklist

When AI is unavailable, verify:

- [ ] AI feature buttons show "unavailable" state
- [ ] No error messages shown to users
- [ ] Core commerce features work normally
- [ ] Manual layout editing still works
- [ ] No infinite retry loops

## Escalation Steps

### If AI critical for business operation:
1. Contact provider support (if premium support)
2. Evaluate temporary feature disable
3. Prepare user communication

### If extended outage > 4 hours:
1. Update status page
2. Email affected users
3. Offer workarounds

## Recovery Verification

After AI restored:

- [ ] AI health check passes
- [ ] Can generate layout suggestion
- [ ] Can preview AI change
- [ ] AI cost tracking working
- [ ] No backlog of failed requests

## Cost Monitoring

Daily AI cost limit: $25

| Threshold | Action |
|-----------|--------|
| $15 | Monitor |
| $20 | Warning alert |
| $25 | Hard stop |

---
**Last Updated:** 2026-02-05
**Owner:** AI/ML Team
