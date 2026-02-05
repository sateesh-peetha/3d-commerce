# API Reference

> **Audience**: Developers, integrators

## Overview

The 3D Commerce API provides RESTful endpoints for all platform operations. All endpoints require authentication unless otherwise noted.

## Base URL

| Environment | Base URL |
|-------------|----------|
| Production | `https://api.3dcommerce.example.com` |
| Staging | `https://api-staging.3dcommerce.example.com` |
| Local | `http://localhost:8080/api` |

## Authentication

All authenticated endpoints require a Firebase JWT token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

### Getting a Token
```javascript
const token = await firebase.auth().currentUser.getIdToken();
```

---

## Endpoints

### Authentication

#### POST /api/auth/verify
Verify user authentication status.

**Auth Required**: Yes

**Request**: Empty body

**Response**:
```json
{
  "authenticated": true,
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

---

### Products

#### GET /api/products
List all products with pagination.

**Auth Required**: No

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 20 | Items per page |
| cursor | string | null | Pagination cursor |
| category | string | null | Filter by category |

**Response**:
```json
{
  "items": [...],
  "nextCursor": "abc123",
  "hasMore": true
}
```

#### GET /api/products/:id
Get single product by ID.

**Auth Required**: No

**Response**:
```json
{
  "id": "prod_123",
  "name": "3D Widget",
  "description": "...",
  "price": 29.99,
  "files": [...]
}
```

#### POST /api/products
Create new product.

**Auth Required**: Yes (Admin)

**Request**:
```json
{
  "name": "New Product",
  "description": "...",
  "price": 29.99,
  "categoryId": "cat_123"
}
```

---

### Cart

#### GET /api/cart
Get current user's cart.

**Auth Required**: Yes

**Response**:
```json
{
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total": 59.98
}
```

#### POST /api/cart/add
Add item to cart.

**Auth Required**: Yes

**Request**:
```json
{
  "productId": "prod_123",
  "quantity": 1
}
```

#### DELETE /api/cart/:itemId
Remove item from cart.

**Auth Required**: Yes

---

### Orders

#### GET /api/orders
List user's orders.

**Auth Required**: Yes

**Response**:
```json
{
  "orders": [
    {
      "id": "order_123",
      "status": "completed",
      "total": 59.98,
      "createdAt": "2026-02-05T10:00:00Z"
    }
  ]
}
```

#### POST /api/orders/checkout
Initiate checkout and create Stripe session.

**Auth Required**: Yes

**Request**:
```json
{
  "cartId": "cart_123",
  "shippingAddress": {...}
}
```

**Response**:
```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

---

### AI

#### POST /api/ai/suggest-layout
Get AI layout suggestions.

**Auth Required**: Yes

**Request**:
```json
{
  "currentLayout": {...},
  "goals": ["increase_conversions"]
}
```

**Response**:
```json
{
  "suggestions": [
    {
      "action": "reorder",
      "target": "hero_block",
      "reasoning": "..."
    }
  ],
  "cost": 0.02
}
```

---

### Admin

#### GET /api/admin/users
List all users (admin only).

**Auth Required**: Yes (Admin)

#### GET /api/admin/analytics
Get platform analytics.

**Auth Required**: Yes (Admin)

---

### Health

#### GET /api/health
Health check endpoint.

**Auth Required**: No

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-05T10:00:00Z",
  "version": "1.0.0"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [...]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | No/invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

| Environment | Limit |
|-------------|-------|
| Production | 100 req/min per user |
| Staging | 300 req/min per user |

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1612345678
```

---

## Webhooks

See [Webhook Documentation](./webhooks.md) for incoming webhook handling.

## Related

- [Firestore Schema](./firestore-schema.md)
- [OpenAPI Spec](./openapi.yaml)
