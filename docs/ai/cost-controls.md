# AI Cost Controls

> **Audience**: Admins, finance, operators

This document describes how AI costs are managed and controlled in 3D Commerce.

## Cost Model

### Pricing

AI operations are billed based on token usage:

| Model | Input (per 1K tokens) | Output (per 1K tokens) |
|-------|----------------------|------------------------|
| Layout suggestions | $0.001 | $0.002 |
| Content generation | $0.001 | $0.003 |
| Complex analysis | $0.002 | $0.004 |

### Typical Costs

| Operation | Average Cost |
|-----------|-------------|
| Single layout suggestion | $0.02 |
| Product description | $0.03 |
| Page analysis | $0.05 |
| Bulk layout (10 pages) | $0.20 |

---

## Budget Configuration

### Hierarchy

```json
{
  "cost_limits": {
    "organization": {
      "monthly": 1000,
      "currency": "USD"
    },
    "project": {
      "monthly": 500
    },
    "daily": {
      "limit": 25
    },
    "per_request": {
      "limit": 0.10,
      "hard_cap": true
    }
  }
}
```

### Setting Budgets

**Admin Panel**: Settings → AI → Cost Controls

```
┌─────────────────────────────────────────┐
│         AI COST CONTROLS                │
├─────────────────────────────────────────┤
│ Monthly Budget:     [$500        ]      │
│ Daily Limit:        [$25         ]      │
│ Per-Request Max:    [$0.10       ]      │
│                                         │
│ Alert at:           [80   ]%            │
│ Block at:           [100  ]%            │
│                                         │
│ [Save Changes]                          │
└─────────────────────────────────────────┘
```

---

## Enforcement

### Request-Level

Before each AI request:

1. Check daily budget remaining
2. Check per-request limit
3. Estimate request cost
4. Block if exceeds limits

```javascript
// Request validation
if (estimatedCost > remainingBudget) {
  throw new AIBudgetExceededError({
    requested: estimatedCost,
    remaining: remainingBudget
  });
}
```

### Rate Limiting

| Limit | Value | Scope |
|-------|-------|-------|
| Requests/minute | 100 | Per user |
| Requests/hour | 500 | Per user |
| Requests/day | 1000 | Per project |

---

## Alerts

### Threshold Alerts

| Threshold | Alert Type | Recipients |
|-----------|------------|------------|
| 50% daily | Info | Dashboard |
| 80% daily | Warning | Dashboard + Email |
| 100% daily | Critical | Admin + Block |
| 80% monthly | Warning | Admin |
| 100% monthly | Critical | Admin + Disable |

### Alert Configuration

```json
{
  "ai_alerts": {
    "daily_warning": {
      "threshold": 0.8,
      "channels": ["dashboard", "email"]
    },
    "daily_critical": {
      "threshold": 1.0,
      "channels": ["dashboard", "email", "slack"],
      "action": "block_requests"
    }
  }
}
```

---

## Tracking & Reporting

### Real-time Dashboard

```
AI Usage Summary (Today)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Requests:     245 / 1000
Cost:         $4.32 / $25.00
Budget used:  17.3%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[■■■░░░░░░░░░░░░░░░░░] 17%
```

### Historical Reports

| Report | Frequency | Contents |
|--------|-----------|----------|
| Daily digest | Daily | Usage, cost, top users |
| Weekly summary | Weekly | Trends, anomalies |
| Monthly invoice | Monthly | Detailed billing |

### Export

```bash
# Export cost data
GET /api/admin/ai/costs?from=2026-02-01&to=2026-02-28

# Response
{
  "period": { "from": "2026-02-01", "to": "2026-02-28" },
  "total_cost": 342.50,
  "requests": 12500,
  "breakdown": [...]
}
```

---

## Optimization

### Cost Reduction Tips

1. **Cache common requests** - Identical prompts return cached results
2. **Batch operations** - Group multiple requests
3. **Limit scope** - Request only needed data
4. **Review usage** - Identify high-cost users/features

### Automatic Optimization

```json
{
  "optimizations": {
    "response_caching": {
      "enabled": true,
      "ttl_seconds": 3600
    },
    "request_deduplication": {
      "enabled": true,
      "window_ms": 1000
    }
  }
}
```

---

## Emergency Procedures

### Over Budget

If budget exceeded:

1. New AI requests blocked
2. Existing requests complete
3. Admin notification sent
4. Budget can be manually increased

### Runaway Costs

If abnormal spending detected:

1. AI features temporarily disabled
2. Security team notified
3. Usage logs reviewed
4. Root cause addressed

---

## Related

- [AI Capability Matrix](./ai-capability-matrix.md)
- [AI Governance Guide](./ai-governance-guide.md)
- [Cost Model](../../distribution/marketplace/cost-model.md)
