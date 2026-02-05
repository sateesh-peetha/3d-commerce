# Installation Guide

> **Audience**: System administrators, DevOps engineers

Complete guide to installing 3D Commerce in local and cloud environments.

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20.x LTS | Required |
| npm | 10.x+ | Comes with Node |
| Docker | 24.x+ | For containerized deployment |
| Git | 2.40+ | Version control |
| Firebase CLI | Latest | `npm i -g firebase-tools` |

---

## Quick Start (Local Development)

### 1. Clone Repository

```bash
git clone https://github.com/your-org/3dcommerce.git
cd 3dcommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env.development

# Edit with your values
nano .env.development
```

Required variables:
```env
RUN_MODE=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
STORAGE_BUCKET=your-project.appspot.com
```

### 4. Start Firebase Emulators

```bash
firebase emulators:start
```

### 5. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## Docker Installation

### 1. Build Images

```bash
cd distribution
docker-compose build
```

### 2. Configure Environment

```bash
cp .env.example .env.local
nano .env.local
```

### 3. Start Services

```bash
docker-compose up -d
```

### 4. Verify

```bash
docker-compose ps
curl http://localhost:8080/api/health
```

---

## Firebase Hosting Deployment

### 1. Login to Firebase

```bash
firebase login
firebase use your-project-id
```

### 2. Configure Firebase

```bash
# Edit firebase.json if needed
cat firebase.json
```

### 3. Build Production

```bash
npm run build
```

### 4. Deploy

```bash
firebase deploy
```

---

## Cloud Run Deployment

### 1. Build Image

```bash
docker build -f distribution/docker/Dockerfile.backend \
  -t gcr.io/your-project/3dcommerce-api .
```

### 2. Push to Registry

```bash
docker push gcr.io/your-project/3dcommerce-api
```

### 3. Deploy to Cloud Run

```bash
gcloud run deploy 3dcommerce-api \
  --image gcr.io/your-project/3dcommerce-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Post-Installation

### Verify Installation

```bash
./distribution/scripts/validate-install.sh
```

### Run Health Checks

```bash
curl http://localhost:8080/api/health
# Expected: {"status":"healthy"}
```

### Create Admin User

```bash
firebase auth:create-admin admin@example.com
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | Change port in .env |
| Firebase auth error | Re-run `firebase login` |
| Missing env vars | Check .env file |
| Docker build fails | Check Node version |

See [Troubleshooting Guide](./troubleshooting-guide.md) for more.

---

## Related

- [Configuration Reference](./configuration-reference.md)
- [Troubleshooting Guide](./troubleshooting-guide.md)
- [Deploy Modes](../../distribution/deploy-modes/)
