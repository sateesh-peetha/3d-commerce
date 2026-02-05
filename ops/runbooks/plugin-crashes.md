# Plugin Crashes Runbook

## Symptoms
- Plugin error rate elevated
- Plugin execution timing out
- Plugin restarts repeatedly (crash loop)
- Users seeing plugin errors
- Specific plugin features not loading
- Alert: PLUGIN001 triggered

## Immediate Actions (First 5 Minutes)

### 1. Identify the Failing Plugin
```bash
gcloud logging read 'jsonPayload.category="plugin" AND jsonPayload.status="error"' --limit=50

# Look for plugin_id in logs
```

### 2. Check Plugin Health
```bash
curl https://api.3dcommerce.example.com/api/health/plugins
```

### 3. Disable the Failing Plugin (if identified)
```bash
# Via Admin UI or API
# This stops the crash loop and protects users
```

### 4. Verify Core System Unaffected
- Check other plugins working
- Verify platform health checks pass

## Diagnostic Checks

### Plugin Crash Loop Detection
- More than 5 restarts in 5 minutes = crash loop
- Automatic disable should trigger

### Common Failure Patterns

| Pattern | Likely Cause |
|---------|--------------|
| Immediate crash on load | Syntax error, missing dependency |
| Crash after some executions | Memory leak, resource exhaustion |
| Timeout | Infinite loop, blocking call |
| Permission error | Trying to access forbidden resource |

### Check Plugin Logs
```bash
# Plugin-specific logs
gcloud logging read 'jsonPayload.plugin_id="PLUGIN_ID"' --limit=100

# Look for:
# - Stack traces
# - Error messages
# - Resource usage warnings
```

### Check Plugin Resource Usage
- Memory usage vs limit (128MB default)
- Execution time vs timeout (10s default)
- API call count

## Quick Fixes

### If Plugin Has Bug
1. Keep plugin disabled
2. Notify plugin developer/maintainer
3. Wait for fix or remove plugin

### If Plugin Exceeded Resources
1. Check if legitimate usage
2. Consider increasing limits (staging first)
3. Or optimize plugin

### If Plugin Trying Forbidden Access
1. This is a SECURITY CONCERN
2. Keep disabled
3. Review plugin permissions
4. Check for malicious behavior

### If Plugin Conflict
1. Identify conflicting plugins
2. Disable both temporarily
3. Enable one at a time to isolate

## Escalation Steps

### If critical business plugin:
1. Notify stakeholders
2. Evaluate workarounds
3. Prioritize fix

### If security concern identified:
1. Escalate to security team
2. Do NOT re-enable
3. See security-alerts runbook

### If multiple plugins affected:
1. Check for platform issue
2. May indicate plugin system problem

## Recovery Verification

After plugin restored:

- [ ] Plugin loads without error
- [ ] Plugin functionality works
- [ ] No excessive resource usage
- [ ] Other plugins unaffected
- [ ] No crash loop recurrence in 30 minutes

## Preventing Future Issues

- Require plugin code review
- Enforce resource limits
- Sandbox plugin execution
- Monitor plugin metrics

---
**Last Updated:** 2026-02-05
**Owner:** Platform Team
