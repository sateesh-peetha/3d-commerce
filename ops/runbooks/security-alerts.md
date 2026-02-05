# Security Alerts Runbook

## Symptoms
- Security event detected by monitoring
- Unusual authentication patterns
- Unauthorized access attempts
- Suspicious admin activity
- Rate limit violations
- Alert: SEC001 triggered

## CRITICAL: First Response

### This is a Security Incident
**Do NOT discuss specifics in public channels.**

1. Move to secure incident channel
2. Document everything
3. Assume adversary may be watching

## Immediate Actions (First 5 Minutes)

### 1. Assess Severity

| Severity | Indicators |
|----------|------------|
| CRITICAL | Active breach, data exfiltration, admin compromise |
| HIGH | Successful unauthorized access, credential leak |
| MEDIUM | Failed attack attempts, suspicious patterns |
| LOW | Minor policy violation, false positive likely |

### 2. Contain the Threat

For CRITICAL/HIGH:
```bash
# Consider immediately:
# - Revoke suspicious sessions
# - Block suspicious IPs
# - Disable compromised accounts
# - Rotate exposed credentials
```

### 3. Preserve Evidence

```bash
# DO NOT delete logs
# Export relevant logs to secure location
# Screenshot any live observations
# Note exact timestamps
```

### 4. Notify Security Lead

For CRITICAL/HIGH: Page immediately
For MEDIUM: Slack notification
For LOW: Normal queue

## Incident Types

### Unauthorized Access Detected
1. Identify affected accounts/resources
2. Revoke active sessions
3. Reset credentials
4. Check for data access

### Brute Force Attack
1. Verify rate limiting active
2. Block attacking IPs if persistent
3. Check for successful attempts
4. Strengthen affected authentication

### Admin Account Compromise
1. **Immediately revoke all admin sessions**
2. Rotate all admin credentials
3. Check for unauthorized changes
4. Review audit logs

### Data Exfiltration Suspected
1. Identify scope of data accessed
2. Preserve access logs
3. Prepare for breach notification
4. Engage legal/compliance

### Plugin Security Violation
1. Disable plugin immediately
2. Check what data plugin accessed
3. Review plugin code
4. Determine if malicious

### AI Prompt Injection Attempt
1. Log the attempt
2. Check if any changes were made
3. Review AI guardrails
4. Block pattern if possible

## Escalation Matrix

| Severity | Response Time | Notify |
|----------|--------------|--------|
| CRITICAL | Immediate | CTO, Legal, Security Team |
| HIGH | 15 minutes | Security Lead, Engineering Lead |
| MEDIUM | 1 hour | Security Team |
| LOW | Next business day | Security Queue |

## Investigation Steps

### 1. Timeline Construction
- When did it start?
- When was it detected?
- What triggered detection?

### 2. Blast Radius
- What systems affected?
- What data accessed?
- What accounts compromised?

### 3. Root Cause
- How did attacker get in?
- What vulnerability exploited?
- Was it preventable?

## Recovery Actions

### Credential Rotation
- [ ] Affected user passwords
- [ ] API keys if exposed
- [ ] Service account keys
- [ ] OAuth secrets

### System Hardening
- [ ] Patch vulnerability
- [ ] Enhance monitoring
- [ ] Update firewall rules
- [ ] Review access controls

### User Communication
- [ ] Affected users notified (if required)
- [ ] Password reset enforced (if needed)
- [ ] Clear instructions provided

## Post-Incident

1. **Secure incident report** (not public)
2. Root cause analysis
3. Remediation plan
4. Security review of similar systems
5. Update detection rules

## Do NOT Do

- ❌ Discuss incident in public channels
- ❌ Delete any logs
- ❌ Ignore "minor" security alerts
- ❌ Wait to escalate CRITICAL issues
- ❌ Assume it's a false positive without verification

---
**Last Updated:** 2026-02-05
**Owner:** Security Team
**Classification:** INTERNAL USE ONLY
