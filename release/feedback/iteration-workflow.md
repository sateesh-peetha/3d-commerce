# Safe Iteration Workflow

> **Audience**: Developers, Engineering Leads

This document defines the process for making changes to the platform post-release.

## Core Principle

**Every change follows the same controlled loop, regardless of urgency.**

```
Feedback/Metrics → Bundle Definition → Agent Pipeline → Checks → Staged Release
```

---

## The Iteration Loop

### Step 1: Trigger

Changes are triggered by:
- User feedback (structured via feedback-schema.json)
- Monitoring alerts
- Scheduled improvements
- Security patches

### Step 2: Bundle Definition

Define a **small, focused bundle**:

| Field | Required | Example |
|-------|----------|---------|
| Scope | ✅ | "Fix checkout timeout" |
| Success criteria | ✅ | "Timeout reduced by 50%" |
| Risk assessment | ✅ | "Low - isolated change" |
| Rollback plan | ✅ | "Revert to v1.2.3" |

**Hard rule**: One concern per bundle.

### Step 3: Agent Pipeline

All changes go through:

1. **Feature-Planner Agent** - Define scope
2. **UI-Composer Agent** - If UI change
3. **Security-Auditor Agent** - Security check
4. **Regression-Guardian Agent** - Test coverage

No shortcuts, even for "simple" changes.

### Step 4: Pre-Merge Checks

- [ ] All tests passing
- [ ] Security scan clean
- [ ] Performance baseline maintained
- [ ] Documentation updated (if needed)

### Step 5: Staged Release

Follow rollout-strategy.json:
1. Canary (1%)
2. Early adopter (10%)
3. Expansion (50%)
4. GA (100%)

Monitor at each stage.

---

## Change Categories

### Standard Change

**Timeline**: Normal development cycle (1-2 days)

```
Backlog item → Bundle → Pipeline → Review → Deploy
```

### Expedited Change

**Timeline**: Same-day deployment

**Allowed for**:
- Minor bug fixes
- Copy changes
- Configuration tuning

**Still requires**:
- Tests
- Code review
- Staged rollout (minimum canary)

### Emergency Change

**Timeline**: Immediate deployment

**Allowed only for**:
- Security vulnerabilities
- Data integrity issues
- Complete service outage

**Process**:
1. Incident declared
2. Fix developed
3. Minimal canary (5 min)
4. Full deployment
5. Post-mortem required

---

## Hard Rules

### ❌ Never Do

1. **Hotfix without tests**
   - Every change gets at least one test

2. **Emergency without rollback**
   - Must verify rollback works before deploying

3. **AI change without approval**
   - All AI behavior changes require human sign-off

4. **Skip the pipeline**
   - Even emergencies run through security scan

### ✅ Always Do

1. **Document the change**
   - Commit message explains why

2. **Monitor after deploy**
   - Watch for 30 min minimum

3. **Update runbooks**
   - If incident revealed gap

---

## Rollback Process

### Automatic Rollback

Triggered by:
- Error rate > 5%
- Health check fails
- Critical alert fires

System automatically:
1. Stops rollout
2. Reverts to previous version
3. Alerts on-call

### Manual Rollback

For less severe issues:

```bash
./release/scripts/rollback.sh --version=previous
```

Verify:
- [ ] Health check passes
- [ ] Error rate normalized
- [ ] Users can transact

---

## Templates

### Change Request Template

```markdown
## Change: [Title]

**Type**: [ ] Standard [ ] Expedited [ ] Emergency

**Scope**: 
[What changes]

**Why**:
[Motivation]

**Risk Level**: [ ] Low [ ] Medium [ ] High

**Success Criteria**:
- [ ] Criteria 1
- [ ] Criteria 2

**Rollback Plan**:
[How to revert]

**Testing**:
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual verification completed
```

---

## Related

- [Rollout Strategy](../rollout/rollout-strategy.json)
- [Feedback Schema](./feedback-schema.json)
- [Release Manager Agent](../../agents/release-manager-agent.json)
