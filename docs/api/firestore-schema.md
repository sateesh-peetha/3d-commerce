# Firestore Schema

> **Audience**: Developers, database administrators

## Overview

3D Commerce uses Firestore as its primary database. This document defines all collections, document structures, and access rules.

## Collections

### users

Stores user profiles and preferences.

**Path**: `users/{userId}`

```json
{
  "uid": "string (matches doc ID)",
  "email": "string",
  "displayName": "string | null",
  "photoURL": "string | null",
  "role": "customer | operator | admin",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "preferences": {
    "theme": "light | dark",
    "notifications": true
  },
  "metadata": {
    "lastLogin": "timestamp",
    "loginCount": "number"
  }
}
```

**Security Rules**:
- Users can read/write their own document
- Admins can read all, write some fields

---

### products

Stores product catalog.

**Path**: `products/{productId}`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "currency": "USD | EUR | GBP",
  "categoryId": "string | null",
  "status": "active | draft | archived",
  "files": [
    {
      "type": "model | thumbnail | preview",
      "path": "string (storage path)",
      "format": "stl | obj | 3mf | jpg | png"
    }
  ],
  "metadata": {
    "printTime": "number (minutes)",
    "material": "string",
    "dimensions": {
      "x": "number",
      "y": "number", 
      "z": "number",
      "unit": "mm | cm | in"
    }
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "createdBy": "string (userId)"
}
```

**Security Rules**:
- Anyone can read active products
- Operators/admins can create/update
- Only admins can delete

---

### orders

Stores customer orders.

**Path**: `orders/{orderId}`

```json
{
  "id": "string",
  "customerId": "string (userId)",
  "status": "pending | paid | processing | shipped | delivered | cancelled",
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "quantity": "number",
      "unitPrice": "number",
      "totalPrice": "number"
    }
  ],
  "totals": {
    "subtotal": "number",
    "tax": "number",
    "shipping": "number",
    "total": "number"
  },
  "payment": {
    "stripeSessionId": "string",
    "stripePaymentIntentId": "string | null",
    "status": "pending | succeeded | failed"
  },
  "shipping": {
    "address": {
      "line1": "string",
      "line2": "string | null",
      "city": "string",
      "state": "string",
      "postalCode": "string",
      "country": "string"
    },
    "trackingNumber": "string | null"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Security Rules**:
- Customers can read their own orders
- Operators can read/update all orders
- Only system can create (via webhook)

---

### carts

Stores shopping carts.

**Path**: `carts/{cartId}`

```json
{
  "id": "string",
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "addedAt": "timestamp"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Security Rules**:
- Users can only access their own cart

---

### plugins

Stores installed plugins.

**Path**: `plugins/{pluginId}`

```json
{
  "id": "string",
  "name": "string",
  "version": "string",
  "author": "string",
  "status": "active | disabled | error",
  "permissions": ["read_products", "write_orders"],
  "config": {},
  "installedAt": "timestamp",
  "installedBy": "string (userId)"
}
```

**Security Rules**:
- Only admins can read/write

---

### audit_logs

Stores security audit events.

**Path**: `audit_logs/{logId}`

```json
{
  "id": "string",
  "action": "string",
  "actor": {
    "userId": "string",
    "role": "string",
    "ip": "string"
  },
  "resource": {
    "type": "string",
    "id": "string"
  },
  "details": {},
  "timestamp": "timestamp"
}
```

**Security Rules**:
- Only admins can read
- Only system can write (append-only)

---

## Indexes

### Composite Indexes

```
products:
  - categoryId ASC, createdAt DESC
  - status ASC, price ASC

orders:
  - customerId ASC, createdAt DESC
  - status ASC, createdAt DESC
```

## Security Rules Summary

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if hasRole('admin');
    }
    
    // Products
    match /products/{productId} {
      allow read: if resource.data.status == 'active';
      allow write: if hasRole('operator') || hasRole('admin');
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.customerId;
      allow read, update: if hasRole('operator');
    }
    
    // Helper function
    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
  }
}
```

## Related

- [API Reference](./api-reference.md)
- [Security Documentation](../../distribution/marketplace/security-posture.md)
