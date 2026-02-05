# GCP Cloud Run Deployment Guide

Deploy 3D Commerce to Google Cloud Run for containerized workloads.

## Prerequisites

- GCP project with billing enabled
- gcloud CLI installed and configured
- Docker installed locally
- Artifact Registry enabled

## Setup

```bash
# 1. Configure gcloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Enable required APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com

# 3. Create Artifact Registry repository
gcloud artifacts repositories create 3dcommerce \
  --repository-format=docker \
  --location=us-central1 \
  --description="3D Commerce container images"
```

## Build and Push Images

```bash
# Configure Docker for Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build images
docker build -f distribution/docker/Dockerfile.backend \
  -t us-central1-docker.pkg.dev/PROJECT_ID/3dcommerce/backend:v1.0.0 .

docker build -f distribution/docker/Dockerfile.frontend \
  -t us-central1-docker.pkg.dev/PROJECT_ID/3dcommerce/frontend:v1.0.0 .

# Push images
docker push us-central1-docker.pkg.dev/PROJECT_ID/3dcommerce/backend:v1.0.0
docker push us-central1-docker.pkg.dev/PROJECT_ID/3dcommerce/frontend:v1.0.0
```

## Configure Secrets

```bash
# Create secrets
echo -n "sk_live_xxx" | gcloud secrets create stripe-secret-key --data-file=-
echo -n "whsec_xxx" | gcloud secrets create stripe-webhook-secret --data-file=-

# Grant service account access
gcloud secrets add-iam-policy-binding stripe-secret-key \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Deploy Backend

```bash
gcloud run deploy 3dcommerce-backend \
  --image=us-central1-docker.pkg.dev/PROJECT_ID/3dcommerce/backend:v1.0.0 \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars="RUN_MODE=production,LOG_LEVEL=warn" \
  --set-secrets="STRIPE_SECRET_KEY=stripe-secret-key:latest"
```

## Deploy Frontend

```bash
gcloud run deploy 3dcommerce-frontend \
  --image=us-central1-docker.pkg.dev/PROJECT_ID/3dcommerce/frontend:v1.0.0 \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5
```

## Custom Domain

```bash
# Map domain
gcloud run domain-mappings create \
  --service=3dcommerce-frontend \
  --domain=app.yourdomain.com \
  --region=us-central1
```

## Continuous Deployment

### Cloud Build trigger

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/3dcommerce/backend:$SHORT_SHA', '-f', 'distribution/docker/Dockerfile.backend', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/3dcommerce/backend:$SHORT_SHA']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    args: ['gcloud', 'run', 'deploy', '3dcommerce-backend', '--image', 'us-central1-docker.pkg.dev/$PROJECT_ID/3dcommerce/backend:$SHORT_SHA', '--region', 'us-central1']
```

## Verify Deployment

```bash
# Get service URL
gcloud run services describe 3dcommerce-backend --region=us-central1 --format='value(status.url)'

# Health check
curl $(gcloud run services describe 3dcommerce-backend --region=us-central1 --format='value(status.url)')/api/health
```

## Rollback

```bash
# List revisions
gcloud run revisions list --service=3dcommerce-backend --region=us-central1

# Route traffic to previous revision
gcloud run services update-traffic 3dcommerce-backend \
  --to-revisions=REVISION_NAME=100 \
  --region=us-central1
```
