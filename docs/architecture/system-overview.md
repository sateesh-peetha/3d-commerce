# System Overview

> **Audience**: All users (developers, operators, admins, plugin authors)

## What Is 3D Commerce?

3D Commerce is a **full-stack e-commerce platform** specialized for 3D printing services. It enables businesses to:

- Showcase and sell 3D models
- Accept orders and process payments
- Manage print workflows
- Extend functionality via plugins
- Leverage AI for layout optimization

## What 3D Commerce Is NOT

- **Not a general-purpose CMS** - Focused on 3D commerce workflows
- **Not a marketplace** - Single-vendor, not multi-vendor
- **Not a 3D modeling tool** - Upload existing models, don't create them
- **Not self-hosted only** - Cloud-native, but can be self-hosted

## Core Principles

### 1. Agent-First Architecture
The system is built around **autonomous agents** that enforce invariants and handle complex workflows. Humans set policy; agents execute it.

### 2. Block-Based UI
All user interfaces are composed of **reusable blocks** with strict contracts. This enables:
- Consistent rendering across devices
- Safe plugin UI injection
- AI-assisted layout optimization

### 3. Configuration Over Code
Behavior is controlled through **JSON configuration** rather than code changes. This makes the system:
- Auditable
- Version-controllable
- Safely modifiable

### 4. Security by Default
Every component assumes hostile input:
- All operations require authentication
- Authorization is enforced at every layer
- Plugins run in sandboxes
- AI actions are constrained

### 5. Observable Everything
All critical paths emit telemetry:
- Structured logging with correlation IDs
- Metrics for performance and reliability
- Alerts for anomalies
- Full audit trails

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 | Server Components, modern UI |
| Backend | Node.js 20 | Serverless functions |
| Database | Firestore | Document database |
| Auth | Firebase Auth | Identity management |
| Storage | Cloud Storage | 3D models, assets |
| Payments | Stripe | Payment processing |
| AI | Gemini API | Layout optimization |
| Hosting | Firebase/GCP | Global CDN, auto-scaling |

## System Components

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTS                            │
│   Web App  │  Mobile (Future)  │  Third-Party API      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   EDGE / CDN                            │
│   Firebase Hosting  │  Static Assets  │  SSL           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   API LAYER                             │
│   Auth  │  Rate Limiting  │  Request Routing           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 AGENT PIPELINE                          │
│   Validation → Composition → Rendering → Output        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                            │
│   Firestore  │  Cloud Storage  │  Stripe               │
└─────────────────────────────────────────────────────────┘
```

## Key Workflows

### Order Flow
1. Customer browses products
2. Customer adds to cart
3. Customer initiates checkout
4. Stripe processes payment
5. Order created in database
6. Notifications sent

### Plugin Flow
1. Plugin installed by admin
2. Plugin permissions granted
3. Plugin hooks into system
4. Plugin runs in sandbox
5. Plugin output validated

### AI Layout Flow
1. User requests layout suggestion
2. AI analyzes current layout
3. AI proposes changes within rules
4. User approves/rejects
5. Changes applied if approved

## Documentation Map

| Need | Document |
|------|----------|
| Understand architecture | [Architecture Deep Dive](./architecture-deep-dive.md) |
| Understand decisions | [Decision Records](./adr/) |
| Use the API | [API Reference](../api/api-reference.md) |
| Build plugins | [Plugin Developer Guide](../plugins/plugin-developer-guide.md) |
| Operate the system | [Operations Guide](../getting-started/installation-guide.md) |
| Handle incidents | [Runbooks](../../ops/runbooks/) |

## Quick Links

- [Installation Guide](../getting-started/installation-guide.md)
- [Configuration Reference](../getting-started/configuration-reference.md)
- [Agent Roster](../agents/agent-roster.md)
- [Block Catalog](../ui/block-catalog.md)
