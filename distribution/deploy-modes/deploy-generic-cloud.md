# Generic Cloud Deployment Guide

Deploy 3D Commerce to any cloud provider that supports Docker containers.

## Architecture Requirements

Your deployment environment must provide:

| Component | Requirement | Options |
|-----------|-------------|---------|
| Container Runtime | Docker-compatible | Docker, containerd, Kubernetes |
| Load Balancer | HTTPS termination | Cloud LB, nginx, Traefik |
| Database | Firestore-compatible | Firestore, MongoDB* |
| Object Storage | Signed URLs support | GCS, S3, Azure Blob |
| Auth | Firebase Auth compatible | Firebase Auth, Auth0* |
| Secrets | Secure injection | Any secrets manager |

*Requires code modifications

## Container Images

### Build locally

```bash
# Backend
docker build -f distribution/docker/Dockerfile.backend \
  -t 3dcommerce-backend:1.0.0 .

# Frontend
docker build -f distribution/docker/Dockerfile.frontend \
  -t 3dcommerce-frontend:1.0.0 .
```

### Push to your registry

```bash
docker tag 3dcommerce-backend:1.0.0 YOUR_REGISTRY/3dcommerce-backend:1.0.0
docker push YOUR_REGISTRY/3dcommerce-backend:1.0.0
```

## Environment Variables

All required environment variables are defined in:
- `distribution/env.schema.json`
- `distribution/secrets.schema.json`

### Minimum Required

```bash
# Runtime
RUN_MODE=production
PORT=8080

# Firebase (required)
FIREBASE_PROJECT_ID=your-project
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
STORAGE_BUCKET=your-bucket

# Payments
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Health Checks

Configure your orchestrator with:

```yaml
healthCheck:
  path: /api/health
  port: 8080
  initialDelaySeconds: 30
  periodSeconds: 30
  timeoutSeconds: 10
  failureThreshold: 3
```

## Kubernetes Deployment (Example)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: 3dcommerce-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: 3dcommerce-backend
  template:
    metadata:
      labels:
        app: 3dcommerce-backend
    spec:
      containers:
      - name: backend
        image: YOUR_REGISTRY/3dcommerce-backend:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: RUN_MODE
          value: "production"
        envFrom:
        - secretRef:
            name: 3dcommerce-secrets
        livenessProbe:
          httpGet:
            path: /api/health/live
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/health/ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
          requests:
            cpu: "250m"
            memory: "128Mi"
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
```

## AWS ECS (Example)

```json
{
  "containerDefinitions": [{
    "name": "3dcommerce-backend",
    "image": "YOUR_REGISTRY/3dcommerce-backend:1.0.0",
    "portMappings": [{"containerPort": 8080}],
    "environment": [
      {"name": "RUN_MODE", "value": "production"}
    ],
    "secrets": [
      {"name": "STRIPE_SECRET_KEY", "valueFrom": "arn:aws:secretsmanager:..."}
    ],
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:8080/api/health || exit 1"],
      "interval": 30,
      "timeout": 10,
      "retries": 3
    },
    "user": "1001"
  }]
}
```

## Azure Container Instances (Example)

```yaml
apiVersion: 2019-12-01
location: eastus
name: 3dcommerce-backend
properties:
  containers:
  - name: backend
    properties:
      image: YOUR_REGISTRY/3dcommerce-backend:1.0.0
      ports:
      - port: 8080
      environmentVariables:
      - name: RUN_MODE
        value: production
      - name: STRIPE_SECRET_KEY
        secureValue: "[reference to Key Vault]"
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 0.5
```

## Security Checklist

- [ ] Containers run as non-root (user 1001)
- [ ] HTTPS enforced at load balancer
- [ ] Secrets injected, not baked into images
- [ ] Health checks configured
- [ ] Resource limits set
- [ ] Logging to central aggregator
- [ ] Monitoring configured
