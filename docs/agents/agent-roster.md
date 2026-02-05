# Agent Roster

> **Audience**: Developers, maintainers, future AI agents

This document catalogs all agents in the 3D Commerce platform with their roles, mandates, and responsibilities.

## Agent Summary

| Agent | Type | Purpose |
|-------|------|---------|
| [Schema-Guard](#schema-guard-agent) | Core | Contract validation |
| [UX-Composer](#ux-composer-agent) | Core | UI composition |
| [AI-Layout](#ai-layout-agent) | Feature | Layout suggestions |
| [Security-Auditor](#security-auditor-agent) | Core | Security validation |
| [Observability](#observability-agent) | Core | Telemetry enforcement |
| [Packaging](#packaging-agent) | Core | Build artifacts |
| [Documentation-Architect](#documentation-architect-agent) | Core | Documentation generation |
| [Plugin-Validator](#plugin-validator-agent) | Validation | Plugin safety |
| [Mobile-Composer](#mobile-composer-agent) | Feature | Mobile layouts |
| [Test-Gate](#test-gate-agent) | Quality | Test enforcement |
| [Chaos-Injector](#chaos-injector-agent) | Testing | Chaos engineering |
| [Performance](#performance-agent) | Monitoring | Performance tracking |

---

## Core Agents

### Schema-Guard Agent

**File**: `agents/schema-guard-agent.json`

**Mandate**: Validate all system contracts before runtime execution.

| Property | Value |
|----------|-------|
| Type | Core |
| Trigger | Build-time, request-time |
| Blocking | Yes |

**Inputs**:
- Schema files from `contracts/`
- Runtime data to validate

**Outputs**:
- Validation pass/fail
- Error details on failure

**Hard Rules**:
- Invalid schemas MUST fail build
- No runtime bypass allowed
- All API inputs validated

---

### UX-Composer Agent

**File**: `agents/ux-composer-agent.json`

**Mandate**: Compose UI layouts from blocks following device rules and theme contracts.

| Property | Value |
|----------|-------|
| Type | Core |
| Trigger | Page render |
| Blocking | Yes |

**Inputs**:
- Screen composition request
- Device type
- Theme configuration

**Outputs**:
- Composed layout
- Rendered blocks

**Hard Rules**:
- Only use approved blocks
- Respect device breakpoints
- Enforce theme tokens

---

### Security-Auditor Agent

**File**: `agents/security-auditor-agent.json`

**Mandate**: Perform hostile audits of authentication, authorization, and data handling.

| Property | Value |
|----------|-------|
| Type | Core |
| Trigger | Pre-release gate |
| Blocking | Yes for release |

**Inputs**:
- Codebase
- Security configuration
- Auth flows

**Outputs**:
- Audit report
- Findings with severity

**Hard Rules**:
- All pre-release checks must pass
- High/critical findings block release
- Audit trail preserved

---

### Observability Agent

**File**: `agents/observability-agent.json`

**Mandate**: Ensure all critical paths emit telemetry signals.

| Property | Value |
|----------|-------|
| Type | Core |
| Trigger | Continuous |
| Blocking | No (alerts) |

**Inputs**:
- Running system
- Log streams
- Metric feeds

**Outputs**:
- Coverage report
- Alert triggers

**Hard Rules**:
- No silent failures
- All auth events logged
- All payment events tracked

---

### Packaging Agent

**File**: `agents/packaging-agent.json`

**Mandate**: Produce reproducible, auditable build artifacts.

| Property | Value |
|----------|-------|
| Type | Core |
| Trigger | Build pipeline |
| Blocking | Yes |

**Inputs**:
- Source code
- Configuration
- Dependencies

**Outputs**:
- Docker images
- Deploy artifacts
- SBOM

**Hard Rules**:
- Builds must be reproducible
- No manual tweaks
- Environment isolated

---

### Documentation-Architect Agent

**File**: `agents/documentation-architect-agent.json`

**Mandate**: Generate structured documentation matching system behavior.

| Property | Value |
|----------|-------|
| Type | Core |
| Trigger | Documentation phase |
| Blocking | Yes for release |

**Inputs**:
- Codebase
- Agent specs
- Contracts

**Outputs**:
- Documentation set
- Coverage report

**Hard Rules**:
- Docs must match code
- No ambiguity allowed
- All subsystems covered

---

## Feature Agents

### AI-Layout Agent

**File**: `agents/ai-layout-agent.json`

**Mandate**: Suggest layout optimizations within governance rules.

| Property | Value |
|----------|-------|
| Type | Feature |
| Trigger | User request |
| Blocking | No (optional) |

**Inputs**:
- Current layout
- User preferences
- Governance rules

**Outputs**:
- Layout suggestions
- Reasoning

**Hard Rules**:
- Stay within cost limits
- No security modifications
- All changes reversible

---

### Mobile-Composer Agent

**File**: `agents/mobile-composer-agent.json`

**Mandate**: Adapt layouts for mobile devices.

| Property | Value |
|----------|-------|
| Type | Feature |
| Trigger | Mobile rendering |
| Blocking | No |

**Inputs**:
- Desktop layout
- Device specifications

**Outputs**:
- Mobile-optimized layout

---

## Validation Agents

### Plugin-Validator Agent

**File**: `agents/plugin-validator-agent.json`

**Mandate**: Validate plugin safety before installation.

| Property | Value |
|----------|-------|
| Type | Validation |
| Trigger | Plugin install |
| Blocking | Yes |

**Inputs**:
- Plugin code
- Permission requests

**Outputs**:
- Safety assessment
- Approved/rejected

**Hard Rules**:
- Sandbox all plugins
- Enforce permission model
- Block dangerous patterns

---

### Test-Gate Agent

**File**: `agents/test-gate-agent.json`

**Mandate**: Enforce test requirements before feature completion.

| Property | Value |
|----------|-------|
| Type | Quality |
| Trigger | PR/merge |
| Blocking | Yes |

**Inputs**:
- Changed code
- Test results

**Outputs**:
- Gate pass/fail
- Coverage metrics

---

## Testing Agents

### Chaos-Injector Agent

**File**: `agents/chaos-injector-agent.json`

**Mandate**: Inject controlled failures for resilience testing.

| Property | Value |
|----------|-------|
| Type | Testing |
| Trigger | Chaos test run |
| Blocking | No |

**Inputs**:
- Target system
- Failure scenarios

**Outputs**:
- Injection results
- System response

---

## Adding New Agents

When creating a new agent:

1. Create JSON spec in `agents/`
2. Define clear mandate
3. Document inputs/outputs
4. Specify hard rules
5. Add to this roster
6. Update execution flow

See [Agent Schemas](./agent-schemas.md) for spec format.
