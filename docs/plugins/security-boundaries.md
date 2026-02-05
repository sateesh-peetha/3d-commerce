# Plugin Security Boundaries

> **Audience**: Plugin developers, security reviewers

This document defines what plugins can and cannot do within the 3D Commerce platform.

## Security Model

Plugins operate in a **sandboxed environment** with explicit permission grants. This protects:
- Core application integrity
- User data privacy
- System stability
- Other plugins

## Permission Model

### Least Privilege

Plugins receive **only the permissions they request** and administrators approve.

```
┌─────────────────────────────────────────────┐
│              CORE SYSTEM                    │
│  ┌───────────────────────────────────────┐  │
│  │         PERMISSION LAYER              │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │        PLUGIN SANDBOX          │  │  │
│  │  │                                │  │  │
│  │  │  Only allowed operations       │  │  │
│  │  │  execute here                  │  │  │
│  │  │                                │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Permission Tiers

| Tier | Access Level | Review Required |
|------|--------------|-----------------|
| **Tier 1** | Read public data | Auto-approve |
| **Tier 2** | Read private data | Admin review |
| **Tier 3** | Write data | Admin + security |
| **Tier 4** | System operations | Manual audit |

---

## What Plugins CAN Do

### ✅ Allowed Operations

| Category | Operations |
|----------|------------|
| **Read Data** | Products, orders (with permission) |
| **UI** | Inject into designated slots |
| **Storage** | Use plugin-scoped storage |
| **API** | Call platform APIs (rate limited) |
| **Events** | Listen to allowed events |
| **AI** | Make AI requests (with permission) |

### Examples

```javascript
// ✅ Read products (requires read_products permission)
const products = await context.api.get('/products');

// ✅ Use plugin storage
await context.storage.set('key', 'value');

// ✅ Show notification
context.api.showToast('Success!');

// ✅ Log messages
context.log.info('Processing complete');
```

---

## What Plugins CANNOT Do

### ❌ Blocked Operations

| Category | Blocked Operations |
|----------|-------------------|
| **DOM** | Access outside slot |
| **Storage** | Access other plugins' data |
| **Network** | Call external URLs directly |
| **System** | Execute shell commands |
| **Auth** | Access tokens or credentials |
| **Database** | Direct database access |
| **Files** | Access filesystem |

### Detection Examples

```javascript
// ❌ BLOCKED: DOM access outside slot
document.querySelector('.core-header');
// Error: DOM access denied

// ❌ BLOCKED: External network
fetch('https://external-site.com');
// Error: External requests not allowed

// ❌ BLOCKED: localStorage
localStorage.getItem('token');
// Error: localStorage access denied

// ❌ BLOCKED: eval/Function
eval('malicious code');
// Error: Code execution blocked
```

---

## Data Access Rules

### User Data

| Data Type | Plugin Access |
|-----------|---------------|
| Email | Never |
| Password | Never |
| Payment info | Never |
| User ID | With permission |
| Preferences | With permission |

### Order Data

| Data Type | Plugin Access |
|-----------|---------------|
| Order items | With permission |
| Order total | With permission |
| Customer address | Never (direct) |
| Payment details | Never |

---

## Resource Limits

### Execution Limits

| Resource | Limit | On Exceed |
|----------|-------|-----------|
| CPU time | 5s per hook | Kill + log |
| Memory | 128MB | Kill + log |
| API calls | 100/min | Rate limit |
| Storage | 10MB | Reject writes |
| DOM nodes | 500 | Reject render |

### Monitoring

```javascript
// Resource usage is tracked
{
  "plugin_id": "my-plugin",
  "cpu_ms": 234,
  "memory_mb": 45,
  "api_calls": 12,
  "storage_bytes": 5242
}
```

---

## Code Restrictions

### Blocked Patterns

These patterns are detected and blocked:

| Pattern | Reason |
|---------|--------|
| `eval()` | Code injection |
| `new Function()` | Code injection |
| `document.write()` | DOM manipulation |
| `innerHTML` (unescaped) | XSS risk |
| `XMLHttpRequest` | Uncontrolled network |
| `WebSocket` | Uncontrolled network |
| `Worker` | Thread escape |

### Static Analysis

Plugins are scanned for:
- Dangerous function calls
- Obfuscated code
- Known malware patterns
- License violations

---

## Isolation Mechanisms

### JavaScript Sandbox

```
┌─────────────────────────────────────┐
│           MAIN THREAD              │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │     WORKER SANDBOX            │  │
│  │  • Frozen prototypes          │  │
│  │  • No global access           │  │
│  │  • Restricted APIs            │  │
│  │  • Message passing only       │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### CSS Isolation

```css
/* Plugin CSS is scoped */
[data-plugin="my-plugin"] .button {
  /* Only affects plugin content */
}
```

---

## Failure Modes

### Graceful Degradation

When a plugin fails:

1. Error is caught at boundary
2. Plugin content replaced with fallback
3. Core application continues
4. Error is logged
5. Admin is notified (if critical)

### Recovery

```javascript
// System auto-disables after repeated failures
{
  "plugin_id": "my-plugin",
  "failures": 5,
  "action": "auto_disabled",
  "reason": "Exceeded failure threshold"
}
```

---

## Security Reviews

### Pre-Publication

All plugins undergo:

1. **Automated scan** - Static analysis
2. **Permission audit** - Necessity check
3. **Code review** - Manual (for Tier 3+)
4. **Sandbox test** - Runtime verification

### Ongoing Monitoring

```
Plugin Activity Monitor
├── API call patterns
├── Error rates
├── Resource usage
└── Anomaly detection
```

---

## Reporting Vulnerabilities

If you find a security issue:

1. Email: security@3dcommerce.example.com
2. Do not disclose publicly
3. Include reproduction steps
4. Response within 48 hours

---

## Related

- [Plugin Developer Guide](./plugin-developer-guide.md)
- [Plugin UI Injection](../ui/plugin-ui-injection.md)
- [Security Posture](../../distribution/marketplace/security-posture.md)
