# Configuration Reference

> **Audience**: System administrators, developers

Complete reference for all configuration options in 3D Commerce.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `RUN_MODE` | Environment mode | `development`, `staging`, `production` |
| `FIREBASE_PROJECT_ID` | Firebase project | `my-3dcommerce-prod` |
| `FIREBASE_AUTH_DOMAIN` | Auth domain | `my-project.firebaseapp.com` |
| `STORAGE_BUCKET` | Storage bucket | `my-project.appspot.com` |
| `API_BASE_URL` | API endpoint | `https://api.example.com` |

### Secret Variables

| Variable | Description | Rotation |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Stripe API key | 90 days |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing | On compromise |
| `FIREBASE_SERVICE_ACCOUNT` | Service account | 365 days |
| `SESSION_SECRET` | Session encryption | 90 days |
| `GEMINI_API_KEY` | AI API key | 180 days |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `info` | Logging verbosity |
| `SENTRY_DSN` | null | Error tracking |
| `ANALYTICS_ID` | null | Google Analytics |
| `CDN_BASE_URL` | null | CDN for assets |
| `RATE_LIMIT_ENABLED` | `true` | Enable rate limiting |
| `CORS_ORIGINS` | `*` | Allowed origins |

### Feature Flags

| Variable | Default | Description |
|----------|---------|-------------|
| `FEATURE_AI_ENABLED` | `true` | AI features |
| `FEATURE_PLUGINS_ENABLED` | `true` | Plugin system |
| `FEATURE_MOBILE_API_ENABLED` | `true` | Mobile API |

---

## Per-Environment Defaults

### Development

```env
RUN_MODE=development
LOG_LEVEL=debug
RATE_LIMIT_ENABLED=false
CORS_ORIGINS=*
```

### Staging

```env
RUN_MODE=staging
LOG_LEVEL=info
RATE_LIMIT_ENABLED=true
```

### Production

```env
RUN_MODE=production
LOG_LEVEL=warn
RATE_LIMIT_ENABLED=true
CORS_ORIGINS=https://mystore.com,https://admin.mystore.com
```

---

## Firebase Configuration

### firebase.json

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*"],
    "rewrites": [
      { "source": "/api/**", "function": "api" },
      { "source": "**", "destination": "/index.html" }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

### Firestore Rules

Located in `firestore.rules`. See [Firestore Schema](../api/firestore-schema.md).

### Storage Rules

Located in `storage.rules`.

---

## Run Mode Configuration

### Limits per Mode

| Setting | Development | Staging | Production |
|---------|-------------|---------|------------|
| Rate limit/min | 1000 | 300 | 100 |
| Max upload MB | 200 | 100 | 100 |
| AI budget/day | $100 | $50 | $25 |
| Log retention | 7 days | 30 days | 90 days |

---

## Docker Configuration

### docker-compose.yml Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FRONTEND_PORT` | 3000 | Frontend port |
| `BACKEND_PORT` | 8080 | API port |
| `EMULATOR_UI_PORT` | 4000 | Firebase UI |

### Resource Limits (Production)

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

---

## Security Configuration

### Rate Limiting

```json
{
  "rate_limiting": {
    "window_ms": 60000,
    "max_requests": 100,
    "message": "Too many requests"
  }
}
```

### CORS

```json
{
  "cors": {
    "origins": ["https://mystore.com"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allowed_headers": ["Content-Type", "Authorization"]
  }
}
```

---

## Validation

Validate your configuration:

```bash
./distribution/scripts/validate-env.sh
```

---

## Related

- [Installation Guide](./installation-guide.md)
- [Environment Schema](../../distribution/env.schema.json)
- [Secrets Schema](../../distribution/secrets.schema.json)
