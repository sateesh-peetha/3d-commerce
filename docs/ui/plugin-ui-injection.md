# Plugin UI Injection

> **Audience**: Plugin developers, security reviewers

This document describes how plugins can inject UI into the 3D Commerce platform safely.

## Overview

Plugins can extend the UI through **designated injection slots**. This ensures:
- Core UI remains stable
- Plugin UI is isolated
- Users can identify plugin content
- Security boundaries enforced

## Injection Slots

### Available Slots

| Slot ID | Location | Typical Use |
|---------|----------|-------------|
| `header-actions` | Header right side | Quick actions |
| `product-details-bottom` | Below product info | Custom info |
| `cart-summary-after` | After cart totals | Upsells |
| `checkout-before-payment` | Before payment | Add-ons |
| `admin-sidebar-bottom` | Admin sidebar | Custom tools |
| `admin-dashboard-widget` | Admin dashboard | Stats widgets |

### Slot Diagram

```
┌─────────────────────────────────────────────┐
│  HEADER                    [header-actions] │
├─────────────────────────────────────────────┤
│                                             │
│  PRODUCT PAGE                               │
│  ┌─────────────────────────────────────┐   │
│  │ Product Details                      │   │
│  │                                      │   │
│  │ [product-details-bottom]             │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│  CART                                       │
│  ┌─────────────────────────────────────┐   │
│  │ Items...                             │   │
│  │ Total: $XX.XX                        │   │
│  │ [cart-summary-after]                 │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Registering UI

### Plugin Manifest

```json
{
  "id": "my-plugin",
  "ui": {
    "injections": [
      {
        "slot": "product-details-bottom",
        "component": "./components/ProductExtra.jsx",
        "priority": 10
      }
    ]
  }
}
```

### Component Registration

```javascript
// plugins/my-plugin/components/ProductExtra.jsx
export default function ProductExtra({ product, context }) {
  return (
    <div className="plugin-content">
      <h4>Extra Info</h4>
      <p>Custom content for {product.name}</p>
    </div>
  );
}
```

---

## Context API

Plugins receive context about where they're injected:

```typescript
interface PluginContext {
  // Current page
  page: 'product' | 'cart' | 'checkout' | 'admin';
  
  // Page-specific data (read-only)
  data: {
    product?: Product;
    cart?: Cart;
    user?: User;
  };
  
  // Plugin APIs
  api: {
    showToast: (message: string) => void;
    trackEvent: (name: string, data: object) => void;
  };
}
```

---

## What Plugins CAN Do

✅ **Allowed Actions**:
- Render UI in designated slots
- Read provided context data
- Add event listeners within their scope
- Use approved API methods
- Apply scoped styling

```javascript
// ✅ Good: Using context data
function MyComponent({ context }) {
  const { product } = context.data;
  return <div>Price: {product.price}</div>;
}
```

---

## What Plugins CANNOT Do

❌ **Blocked Actions**:
- Modify core UI elements
- Access DOM outside their slot
- Override theme variables
- Intercept navigation
- Access sensitive data directly
- Execute arbitrary JavaScript

```javascript
// ❌ Bad: Accessing DOM outside slot
document.querySelector('.header-logo').remove(); // BLOCKED

// ❌ Bad: Modifying theme
document.documentElement.style.setProperty('--color-primary', 'red'); // BLOCKED

// ❌ Bad: Accessing window APIs
window.localStorage.getItem('authToken'); // BLOCKED
```

---

## Styling Rules

### Scoped CSS

Plugin CSS is automatically scoped:

```css
/* Plugin writes */
.button { color: blue; }

/* Rendered as */
[data-plugin="my-plugin"] .button { color: blue; }
```

### CSS Restrictions

| Allowed | Blocked |
|---------|---------|
| Custom classes | `:root` selectors |
| Component styles | Global selectors |
| CSS variables (local) | Theme variable overrides |
| Animations | `position: fixed` |

---

## Security Sandbox

Plugin UI runs in a sandbox:

```
┌─────────────────────────────────────┐
│           CORE APPLICATION          │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │     PLUGIN SANDBOX          │   │
│  │  ┌───────────────────────┐  │   │
│  │  │    Plugin Component   │  │   │
│  │  │    (isolated scope)   │  │   │
│  │  └───────────────────────┘  │   │
│  │  • No DOM access outside   │   │
│  │  • No window APIs          │   │
│  │  • Rate-limited events     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Resource Limits

| Resource | Limit |
|----------|-------|
| Render time | 100ms |
| DOM nodes | 500 |
| Event listeners | 20 |
| API calls | 10/second |

---

## Validation

Before injection, plugin UI is validated:

1. **Static analysis** - Check for dangerous patterns
2. **CSP compliance** - Verify content security
3. **Performance check** - Measure render time
4. **Size limit** - Bundle under 100KB

---

## Error Handling

If plugin UI fails:

1. Plugin content replaced with error boundary
2. Error logged with plugin ID
3. Core UI continues functioning
4. User sees generic error message

```jsx
// What users see when plugin fails
<div className="plugin-error">
  Plugin content unavailable
</div>
```

---

## Best Practices

### Do
- Keep UI simple and focused
- Handle loading states
- Provide fallback content
- Use theme tokens for styling
- Test on all device sizes

### Don't
- Assume data is available
- Block the main thread
- Create excessive DOM
- Use inline scripts
- Rely on external resources

---

## Related

- [Block Catalog](./block-catalog.md)
- [Plugin Developer Guide](../plugins/plugin-developer-guide.md)
- [Security Boundaries](../plugins/security-boundaries.md)
