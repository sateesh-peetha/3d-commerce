# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Web App   │  │ Mobile App  │  │  Third-Party │            │
│  │   (React)   │  │   (Future)  │  │     API      │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EDGE / CDN LAYER                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Firebase Hosting / CDN                      │   │
│  │         (Static assets, SSL termination)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Firebase Functions / Cloud Run                 │   │
│  │     (Authentication, Rate Limiting, Request Routing)     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │   Auth    │  │  Commerce │  │  Storage  │  │    AI     │   │
│  │  Service  │  │  Service  │  │  Service  │  │  Service  │   │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                   │
│  │  Plugin   │  │   Admin   │  │  Webhook  │                   │
│  │  Runtime  │  │  Service  │  │  Handler  │                   │
│  └───────────┘  └───────────┘  └───────────┘                   │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │    Firestore    │  │  Cloud Storage  │  │   Stripe      │  │
│  │   (Database)    │  │    (Files)      │  │  (Payments)   │  │
│  └─────────────────┘  └─────────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   OBSERVABILITY LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │  Cloud Logging  │  │ Cloud Monitoring │  │    Alerts    │  │
│  └─────────────────┘  └─────────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React SPA)
- **Technology**: React 18 with Server Components
- **Hosting**: Firebase Hosting with global CDN
- **Build**: Vite with optimized chunking
- **Size**: < 500KB initial bundle

### Backend (Serverless)
- **Runtime**: Node.js 20 LTS
- **Platform**: Firebase Functions (Gen 2) or Cloud Run
- **Scaling**: 0-100 instances, auto-scaling
- **Memory**: 512MB default, configurable

### Database (Firestore)
- **Type**: Document database
- **Scaling**: Automatic
- **Consistency**: Strong per-document
- **Security**: Rules-based access control

### Storage (Cloud Storage)
- **Purpose**: 3D model files, thumbnails, exports
- **Access**: Signed URLs (time-limited)
- **CDN**: Integrated with Firebase

### Auth (Firebase Auth)
- **Methods**: Email/password, Google, SSO
- **MFA**: Optional, supported
- **Sessions**: JWT-based

### Payments (Stripe)
- **Flow**: Server-side checkout
- **Webhooks**: Signature-verified
- **PCI**: Compliant (Stripe handles card data)

## Data Flow

### Order Placement
1. User adds items to cart (client-side)
2. Cart submitted to API
3. API creates Stripe Checkout session
4. User completes payment on Stripe
5. Webhook confirms payment
6. Order created in Firestore
7. Confirmation sent to user

### 3D Model Upload
1. Client requests signed upload URL
2. API validates user permissions
3. Signed URL generated (15 min expiry)
4. Client uploads directly to Storage
5. Upload completion triggers processing
6. Thumbnail generated
7. Model metadata stored in Firestore

## Security Architecture

- All traffic encrypted (TLS 1.3)
- Authentication required for all write operations
- Role-based access control (RBAC)
- Plugin sandboxing with resource limits
- Audit logging for security events
- Secrets managed externally (Secret Manager)

## Scalability

| Component | Scaling Model | Limits |
|-----------|--------------|--------|
| Frontend | CDN (unlimited) | Edge caching |
| API | Auto-scale | 100 concurrent |
| Database | Managed | 10K writes/sec |
| Storage | Unlimited | Per-bucket quotas |
