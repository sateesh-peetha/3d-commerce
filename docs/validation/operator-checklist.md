# Operator Checklist

> **Purpose**: Validate that an operator can handle incidents using only documentation.

## Test Subject
An operator with general ops experience but no prior exposure to this system.

---

## Phase 1: System Access

| Step | Documentation | Success Criteria |
|------|--------------|------------------|
| Access monitoring | [Runbook Index](../getting-started/runbook-index.md) | Can view dashboards |
| Access logs | Runbook Index | Can search logs |
| Access admin panel | [Installation Guide](../getting-started/installation-guide.md) | Can login to admin |

### Validation Questions
- [ ] All access credentials documented?
- [ ] Monitoring tools accessible?

---

## Phase 2: Incident Simulation - System Down

**Scenario**: Simulate a system down incident.

| Step | Documentation | Notes |
|------|--------------|-------|
| Identify symptoms | Runbook Index → System Down | |
| Follow runbook | Runbook | Step by step |
| Execute diagnostic commands | Runbook | |
| Identify root cause | Runbook | |
| Verify recovery | Runbook | Checklist |

### Time Limit
- Expected: 15-30 minutes
- If > 1 hour: Documentation gap

### Validation Questions
- [ ] Runbook had all needed commands?
- [ ] Recovery verification clear?
- [ ] Escalation path documented?

---

## Phase 3: Incident Simulation - Payment Failed

**Scenario**: Customer reports checkout failing.

| Step | Documentation | Notes |
|------|--------------|-------|
| Identify symptoms | Runbook → Payment Failures | |
| Check Stripe status | Runbook | |
| Verify webhook | Runbook | |
| Test checkout | Runbook | |
| Verify recovery | Runbook | |

### Validation Questions
- [ ] Stripe troubleshooting clear?
- [ ] Webhook testing documented?

---

## Phase 4: Incident Simulation - Security Alert

**Scenario**: Suspicious login detected.

| Step | Documentation | Notes |
|------|--------------|-------|
| Review audit logs | Runbook → Security Alert | |
| Assess threat | Runbook | |
| Contain if needed | Runbook | |
| Preserve evidence | Runbook | |
| Escalate | Runbook | |

### Validation Questions
- [ ] Response steps clear?
- [ ] Escalation contacts available?
- [ ] Evidence preservation documented?

---

## Scoring

### Rating Scale
- **5**: Handled without any assistance
- **4**: Minor confusion, resolved with docs
- **3**: Needed one clarification
- **2**: Needed multiple clarifications
- **1**: Could not handle without help

### Target Scores
- System Access: ≥4
- System Down: ≥4
- Payment Failure: ≥4
- Security Alert: ≥3

---

## Gap Identification

After each simulation:

1. **Where did operator get stuck?**
2. **What runbook steps were missing?**
3. **What commands didn't work as documented?**
4. **Suggested improvements**

---

## Sign-Off

| Criterion | Met |
|-----------|-----|
| Operator can access system | [ ] |
| Operator can diagnose issues | [ ] |
| Operator can follow runbooks | [ ] |
| Operator can verify recovery | [ ] |
| Operator knows when to escalate | [ ] |

**Total Score**: ___ / 20

**Runbooks Approved**: [ ] Yes [ ] No - needs improvements

---

## Related

- [Developer Onboarding](./onboarding-checklist.md)
- [Runbook Index](../getting-started/runbook-index.md)
