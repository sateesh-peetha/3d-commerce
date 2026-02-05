# Documentation Index

> **3D Commerce Platform - Complete Documentation**

## Quick Links

| Need | Document |
|------|----------|
| **Get Started** | [Installation Guide](./getting-started/installation-guide.md) |
| **Understand System** | [System Overview](./architecture/system-overview.md) |
| **Build Plugins** | [Plugin Developer Guide](./plugins/plugin-developer-guide.md) |
| **Handle Incidents** | [Runbook Index](./getting-started/runbook-index.md) |

---

## Architecture

| Document | Description |
|----------|-------------|
| [System Overview](./architecture/system-overview.md) | What the platform is and isn't |
| [Architecture Deep Dive](./architecture/architecture-deep-dive.md) | Component details and data flow |
| [ADR: Firebase](./architecture/adr/001-firebase-selection.md) | Why Firebase was chosen |
| [ADR: Block UI](./architecture/adr/002-block-based-ui.md) | Block-based architecture |
| [ADR: Agents](./architecture/adr/003-agentic-architecture.md) | Agent-first design |
| [ADR: AI Governance](./architecture/adr/004-ai-governance.md) | AI constraints |

---

## Agents

| Document | Description |
|----------|-------------|
| [Agent Roster](./agents/agent-roster.md) | All 12 agents with roles |
| [Agent Schemas](./agents/agent-schemas.md) | Input/output specifications |
| [Execution Flow](./agents/execution-flow.md) | Pipeline and gates |

---

## API & Data

| Document | Description |
|----------|-------------|
| [API Reference](./api/api-reference.md) | All endpoints with auth |
| [Firestore Schema](./api/firestore-schema.md) | Database collections |
| [OpenAPI Spec](./api/openapi.yaml) | Machine-readable spec |

---

## UI & Blocks

| Document | Description |
|----------|-------------|
| [Block Catalog](./ui/block-catalog.md) | All 25 UI blocks |
| [Theme System](./ui/theme-system.md) | CSS tokens |
| [Plugin UI Injection](./ui/plugin-ui-injection.md) | Safe extension points |

---

## Plugins

| Document | Description |
|----------|-------------|
| [Developer Guide](./plugins/plugin-developer-guide.md) | Build plugins |
| [Security Boundaries](./plugins/security-boundaries.md) | What plugins can/cannot do |
| [Templates](./plugins/plugin-templates/) | Starter plugins |

---

## AI Governance

| Document | Description |
|----------|-------------|
| [Capability Matrix](./ai/ai-capability-matrix.md) | What AI can do |
| [Governance Guide](./ai/ai-governance-guide.md) | Rules and approvals |
| [Cost Controls](./ai/cost-controls.md) | Budgets and limits |

---

## Operations

| Document | Description |
|----------|-------------|
| [Installation Guide](./getting-started/installation-guide.md) | Local/cloud setup |
| [Configuration Reference](./getting-started/configuration-reference.md) | All env vars |
| [Troubleshooting](./getting-started/troubleshooting-guide.md) | Common issues |
| [Runbook Index](./getting-started/runbook-index.md) | Incident response |

---

## Validation

| Document | Description |
|----------|-------------|
| [Developer Onboarding](./validation/onboarding-checklist.md) | Onboarding test |
| [Operator Checklist](./validation/operator-checklist.md) | Incident test |
| [Coverage Report](./validation/coverage-report.json) | Doc completeness |

---

## Distribution

See [Distribution Documentation](../distribution/) for:
- Deployment guides
- Docker configurations
- Marketplace artifacts
- Lifecycle scripts
