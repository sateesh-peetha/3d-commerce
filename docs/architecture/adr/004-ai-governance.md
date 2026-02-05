# ADR 004: AI Governance Model

## Status
**Accepted** - 2026-01-30

## Context
We integrated AI (Gemini API) for layout optimization and content suggestions. We needed to:
- Define what AI can and cannot do
- Prevent runaway costs
- Ensure actions are reversible
- Maintain human oversight
- Meet security requirements

## Decision
We implemented a **constrained AI governance model** where AI operates within strict boundaries, all actions are reversible, and cost controls are enforced.

## Rationale

### Why Constrained AI

| Approach | Safety | Usefulness | Cost Control |
|----------|--------|------------|--------------|
| Unrestricted | Low | High | None |
| **Constrained** | **High** | **Good** | **Yes** |
| Disabled | Maximum | None | N/A |

### Key Benefits

1. **Predictable behavior** - AI can only do allowed actions
2. **Cost protection** - Daily and per-request limits
3. **Reversibility** - All changes can be undone
4. **Auditability** - All AI actions logged
5. **Human control** - Approval workflows for sensitive changes

### Governance Model

```
AI Governance
├── Allowed Actions
│   ├── Reorder blocks (within rules)
│   ├── Toggle visibility
│   ├── Suggest layouts
│   └── Generate descriptions
├── Blocked Actions
│   ├── Create new blocks
│   ├── Modify security
│   ├── Access external URLs
│   ├── Execute code
│   └── Modify payments
├── Cost Controls
│   ├── $25/day limit
│   ├── 100 calls/minute
│   └── Budget alerts
└── Approval Workflow
    ├── Layout changes → Auto-apply (reversible)
    ├── Content changes → User approval
    └── Security changes → Never allowed
```

### Trade-offs Accepted

1. **Reduced capability** - AI cannot do everything
2. **User friction** - Some actions require approval
3. **Development overhead** - Must maintain governance rules

## Consequences

### Positive
- No unexpected AI behavior
- Costs predictable and capped
- Security maintained
- User trust preserved

### Negative
- Some useful AI capabilities blocked
- Approval workflow adds steps
- Must update rules as AI evolves

## Alternatives Considered

### Unrestricted AI
- Maximum AI capability
- Unpredictable behavior
- Runaway cost risk

### AI Only for Suggestions
- Very safe
- Misses automation benefits
- User must do all work

### No AI
- Simplest
- Missing competitive feature
- No learning capability

## Implementation

### Cost Control
```json
{
  "limits": {
    "daily_budget": "$25",
    "per_request_max": "$0.10",
    "requests_per_minute": 100
  }
}
```

### Action Validation
Every AI request is validated against the governance rules before execution.

### Audit Logging
```json
{
  "ai_action": {
    "type": "reorder_blocks",
    "input": {...},
    "output": {...},
    "cost": "$0.02",
    "approved_by": "system",
    "reversible": true
  }
}
```

## Related
- [AI Capability Matrix](../../ai/ai-capability-matrix.md)
- [AI Governance Guide](../../ai/ai-governance-guide.md)
- [ADR 003: Agentic Architecture](./003-agentic-architecture.md)
