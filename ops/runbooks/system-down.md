# System Down Runbook

## Symptoms
- All health checks failing
- Users cannot access the platform
- API requests returning 5xx errors
- No response from any endpoints
- GCP Console shows service errors

## Immediate Actions (First 5 Minutes)

### 1. Confirm the Outage
```bash
# Check health endpoint
curl -I https://api.3dcommerce.example.com/api/health

# Check from multiple locations if possible
# Verify it's not a local network issue
```

### 2. Check GCP Status
- Visit [GCP Status Dashboard](https://status.cloud.google.com/)
- Check Firebase Status
- Check Cloud Run / Functions status

### 3. Notify Stakeholders
```
Post to #incidents Slack channel:
"INCIDENT: System down. Investigating. Updates every 15 minutes."
```

### 4. Quick Diagnostics
```bash
# Check Firebase Functions logs
firebase functions:log --project=3dcommerce-prod

# Check Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# Check Firestore connection
# (via admin SDK or Console)
```

## Escalation Steps

### If outage continues > 15 minutes:
1. Page secondary on-call
2. Notify engineering lead
3. Update status page: "We are experiencing an outage. Team is investigating."

### If outage continues > 30 minutes:
1. Page incident commander
2. Consider activating DR plan (see dr-config.json)
3. Prepare external communication

### If GCP regional outage confirmed:
1. Activate DR runbook
2. Begin restore to backup region
3. Update DNS when ready

## Recovery Verification

After services restored:

- [ ] Health check passes: `/api/health` returns 200
- [ ] Can complete login flow
- [ ] Can view products
- [ ] Can add to cart
- [ ] Can view orders
- [ ] Error rate returned to baseline
- [ ] No new critical alerts

## Post-Incident

1. Document timeline in incident report
2. Schedule blameless post-mortem within 48 hours
3. Update runbook with lessons learned

---
**Last Updated:** 2026-02-05
**Owner:** SRE Team
