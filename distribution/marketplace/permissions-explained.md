# Permissions Explained

## Overview

This document explains why 3D Commerce requires certain permissions and how they are used.

## Firebase/GCP Permissions

### Firestore Database

| Permission | Purpose | Justification |
|------------|---------|---------------|
| Read all collections | Load user data, products, orders | Core application functionality |
| Write to user-scoped collections | Save user preferences, cart | Required for user experience |
| Write to order collection | Create and update orders | E-commerce functionality |

**Data accessed:**
- User profiles (email, name, preferences)
- Products (3D models, descriptions, pricing)
- Orders (purchase history)
- Cart (temporary shopping data)

### Cloud Storage

| Permission | Purpose | Justification |
|------------|---------|---------------|
| Read objects | Display 3D models, images | Core product display |
| Write objects | Upload 3D models | Product management |
| Generate signed URLs | Secure file access | Prevent unauthorized downloads |

**Buckets used:**
- `3d-models/` - Customer 3D model files
- `thumbnails/` - Generated preview images
- `exports/` - Generated export files

### Firebase Auth

| Permission | Purpose | Justification |
|------------|---------|---------------|
| Verify tokens | Authenticate API requests | Security |
| Read user info | Get email, display name | User identification |
| Manage users (admin only) | Admin operations | User management |

### Cloud Functions / Cloud Run

| Permission | Purpose | Justification |
|------------|---------|---------------|
| Invoke functions | Handle API requests | Backend operations |
| Access secrets | Load API keys at runtime | Secure configuration |

## Third-Party Service Permissions

### Stripe

| Permission | Purpose | Justification |
|------------|---------|---------------|
| Create checkout sessions | Accept payments | Core commerce |
| Read payment status | Verify payments | Order confirmation |
| Process refunds (optional) | Customer service | Order management |

**Data shared with Stripe:**
- Order total and line items
- Customer email (for receipts)
- No card data (handled by Stripe)

### AI Provider (Gemini/OpenAI)

| Permission | Purpose | Justification |
|------------|---------|---------------|
| API calls | Generate layout suggestions | AI feature |

**Data shared:**
- Page layout structure (anonymized)
- No customer PII
- No payment data

**Rate limits:**
- 10 calls/minute in production
- $25/day cost cap

## Scope Minimization

We follow the principle of least privilege:

1. **No admin SDK in client** - All sensitive operations via server
2. **User-scoped reads** - Users only see their own data
3. **Time-limited URLs** - Signed URLs expire in 15 minutes
4. **Separate service accounts** - Different privileges per component

## What We Do NOT Access

| Data Type | Accessed? | Notes |
|-----------|-----------|-------|
| Credit card numbers | ❌ No | Stripe handles all card data |
| ID documents | ❌ No | Not collected |
| Social connections | ❌ No | Not integrated |
| Location data | ❌ No | Not collected |
| Device identifiers | ❌ No | Not collected |

## Revoking Permissions

Users can:
1. Delete their account (removes all data)
2. Disconnect OAuth providers
3. Request data export (GDPR)

Admins can:
1. Revoke API keys
2. Disable service account keys
3. Remove OAuth app connections

## Changes to Permissions

If we need additional permissions in a future version:
1. Users will be notified before upgrade
2. New permissions explained in release notes
3. Users can choose not to upgrade

## Questions?

Contact: privacy@3dcommerce.example.com
