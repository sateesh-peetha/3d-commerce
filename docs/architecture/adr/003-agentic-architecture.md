# ADR 003: Agentic Architecture

## Status
**Accepted** - 2026-01-25

## Context
We needed an architecture that:
- Handles complex, multi-step workflows
- Enforces system invariants automatically
- Reduces human error in critical paths
- Supports AI-assisted operations
- Scales with system complexity

## Decision
We adopted an **agentic architecture** where autonomous agents handle complex operations, enforce invariants, and execute within defined mandates.

## Rationale

### Why Agents

| Approach | Invariant Enforcement | Complexity Handling | AI Integration |
|----------|----------------------|---------------------|----------------|
| Monolithic | Manual | Difficult | Hard |
| Microservices | Per-service | Medium | Medium |
| **Agentic** | **Automatic** | **Good** | **Native** |

### Key Benefits

1. **Invariant enforcement** - Agents automatically validate rules
2. **Clear responsibilities** - Each agent has one mandate
3. **Audit trail** - All agent actions logged
4. **AI-native** - Agents can invoke or be AI
5. **Testable** - Agents tested in isolation

### Agent Model

```
Agent
├── ID (unique identifier)
├── Type (core, feature, validation)
├── Mandate (what it MUST do)
├── Inputs (what it receives)
├── Outputs (what it produces)
├── Constraints (what it CANNOT do)
└── Gates (what must pass before completion)
```

### Agent Roster (12 Agents)

| Agent | Type | Purpose |
|-------|------|---------|
| Schema-Guard | core | Schema validation |
| UX-Composer | core | UI composition |
| AI-Layout | feature | Layout suggestions |
| Security-Auditor | core | Security checks |
| Observability | core | Telemetry |
| Packaging | core | Build artifacts |
| Documentation | core | Generate docs |
| Plugin-Validator | validation | Plugin safety |
| Cost-Controller | validation | AI cost limits |
| Backup-Agent | ops | Data protection |
| DR-Agent | ops | Disaster recovery |
| Performance-Agent | monitoring | Performance |

### Trade-offs Accepted

1. **Complexity** - More moving parts than simple services
2. **Learning curve** - Team must understand agent model
3. **Debugging** - Multi-agent flows harder to trace

## Consequences

### Positive
- System invariants enforced automatically
- Complex workflows manageable
- AI integration straightforward
- Clear ownership of responsibilities

### Negative  
- More initial design effort
- Agent coordination overhead
- Must maintain agent contracts

## Alternatives Considered

### Traditional Services
- Simpler mental model
- Manual invariant enforcement
- Harder to add AI

### Event-Driven
- Good for async
- Harder to enforce synchronous invariants
- Complex error handling

### Pure Functional
- Strong guarantees
- Limited team experience
- Harder to integrate with existing tools

## Related
- [Agent Roster](../../agents/agent-roster.md)
- [Architecture Deep Dive](../architecture-deep-dive.md)
- [ADR 004: AI Governance](./004-ai-governance.md)
