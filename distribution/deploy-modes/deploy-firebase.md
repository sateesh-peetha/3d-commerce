# Firebase Deployment Guide

Deploy 3D Commerce to Firebase (recommended primary target).

## Prerequisites

- Node.js 20.x
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project with Blaze plan
- GCP project linked

## Setup

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize project (if needed)
firebase init

# 3. Set project
firebase use --add
# Select your project
```

## Environment Configuration

### Set environment variables

```bash
# Set Functions config
firebase functions:config:set \
  stripe.secret_key="sk_live_xxx" \
  stripe.webhook_secret="whsec_xxx" \
  ai.api_key="xxx"

# Verify
firebase functions:config:get
```

### For production

Create `.env.production`:
```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_API_BASE_URL=https://us-central1-your-project.cloudfunctions.net
```

## Deploy

### Full deployment

```bash
# Deploy everything
firebase deploy

# Or deploy specific targets
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Incremental deployment

```bash
# Deploy only changed functions
firebase deploy --only functions:functionName
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
          channelId: live
```

## Verify Deployment

```bash
# Check hosting
curl https://your-project.web.app/

# Check functions
curl https://us-central1-your-project.cloudfunctions.net/api/health

# Check logs
firebase functions:log
```

## Rollback

```bash
# List previous versions
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL TARGET_SITE_ID:live

# Rollback functions
# Deploy previous git commit
git checkout HEAD~1
firebase deploy --only functions
```

## Cost Monitoring

- Enable budget alerts in GCP Console
- Monitor Functions invocations
- Set up billing alerts

## Security Checklist

- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Functions use service account
- [ ] API keys restricted
- [ ] CORS configured
