# Golden Path Specification

**Version**: 1.0.0  
**Spec Hash**: `GOLDEN-2026-02-04-gp001`  
**Status**: FROZEN  

---

## Scope

### Included Screens

| Screen | Device | Auth |
|--------|--------|------|
| Home | Web Desktop | Public |
| 3D Upload + Configure | Web Desktop | Public |
| Checkout | Web Desktop | Required |
| Order Confirmation | Web Desktop | Required |
| Admin Dashboard | Web Desktop | Admin |
| Admin API Keys | Web Desktop | Admin |

### Excluded (Intentionally)

- Mobile apps (iOS, Android)
- Plugin marketplace
- Blog / CMS
- Multi-tenant
- Real payment gateway
- Email notifications

---

## UI Blocks Per Screen

### Home
- `header-main-nav`
- `prompt-box`
- `product-grid` (featured only)
- `footer-main`

### 3D Upload + Configure
- `header-main-nav`
- `file-upload`
- `model-viewer`
- `config-panel`
- `material-selector`
- `pricing-box`
- `footer-main`

### Checkout
- `header-main-nav` (minimal)
- `cart-summary`
- **Add**: Shipping form (from `components.css`)
- **Add**: Mock payment button

### Order Confirmation
- `header-main-nav`
- `order-card`
- **Add**: Success message

### Admin Dashboard
- `header-main-nav` (admin mode)
- `kpi-grid`
- `printer-status`
- `order-queue`
- `prompt-box` (AI layout change)

### Admin API Keys
- `header-main-nav` (admin mode)
- **Add**: API key form (single provider)

---

## Required APIs

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/products` | GET | Public | Featured products |
| `/api/materials` | GET | Public | Material options |
| `/api/pricing/estimate` | POST | Public | Calculate price |
| `/api/upload` | POST | Public | Upload 3D file |
| `/api/cart` | GET/POST | User | Cart management |
| `/api/orders` | POST | User | Create order |
| `/api/orders/:id` | GET | User | Order details |
| `/api/admin/dashboard` | GET | Admin | KPI data |
| `/api/admin/orders` | GET | Admin | All orders |
| `/api/admin/api-keys` | GET/POST | Admin | Manage keys |
| `/api/admin/layout` | POST | Admin | AI layout change |

---

## User Roles

| Role | Capabilities |
|------|--------------|
| `guest` | Browse, upload, configure |
| `customer` | Checkout, view own orders |
| `admin` | View all orders, manage API keys, AI layout |

---

## Success Criteria

1. User uploads file → configures → places order
2. User sees order confirmation
3. Admin sees order in dashboard
4. Admin changes layout via AI prompt
5. Layout change persists on refresh
6. All tests pass (unit, integration, e2e, security)
7. No manual patches required

---

## Constraints

- Web desktop only (≥1024px)
- Mock payment (no real gateway)
- Single API key provider
- AI can reorder blocks only, not create new ones
