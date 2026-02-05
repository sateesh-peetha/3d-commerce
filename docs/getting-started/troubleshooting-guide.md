# Troubleshooting Guide

> **Audience**: Developers, operators

Solutions to common issues when running 3D Commerce.

## Quick Diagnostics

```bash
# Check system health
curl http://localhost:8080/api/health

# Check environment
./distribution/scripts/validate-env.sh

# Check Docker containers
docker-compose ps

# Check logs
docker-compose logs -f --tail=100
```

---

## Installation Issues

### Node Version Mismatch

**Symptom**: Build fails with syntax errors

**Solution**:
```bash
# Check version
node --version

# Should be 20.x
nvm install 20
nvm use 20
```

### Missing Dependencies

**Symptom**: `Module not found` errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

**Symptom**: `EADDRINUSE` error

**Solution**:
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process or change port in .env
set PORT=3001
```

---

## Firebase Issues

### Authentication Failed

**Symptom**: `Firebase Auth Error: invalid-api-key`

**Solution**:
1. Verify `FIREBASE_API_KEY` in .env
2. Check project settings in Firebase Console
3. Re-run `firebase login`

### Emulator Won't Start

**Symptom**: Emulator ports conflict

**Solution**:
```bash
# Kill existing emulators
taskkill /F /IM java.exe

# Start fresh
firebase emulators:start --clear
```

### Firestore Permission Denied

**Symptom**: `permission-denied` errors

**Solution**:
1. Check Firestore rules
2. Verify user authentication
3. Check role in user document

---

## Docker Issues

### Build Fails

**Symptom**: Docker build errors

**Solution**:
```bash
# Rebuild without cache
docker-compose build --no-cache

# Check Docker resources
docker system df
docker system prune
```

### Container Won't Start

**Symptom**: Container exits immediately

**Solution**:
```bash
# Check logs
docker logs 3dcommerce-api

# Check environment
docker-compose config

# Verify env file exists
ls -la .env.local
```

### Health Check Failing

**Symptom**: Container marked unhealthy

**Solution**:
```bash
# Test health endpoint directly
docker exec 3dcommerce-api curl localhost:8080/api/health

# Check container resources
docker stats
```

---

## API Issues

### 401 Unauthorized

**Symptom**: API returns 401

**Causes**:
- Missing or expired token
- Invalid API key
- Wrong authentication method

**Solution**:
```javascript
// Ensure token is included
const token = await firebase.auth().currentUser.getIdToken();
fetch('/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 429 Too Many Requests

**Symptom**: Rate limit exceeded

**Solution**:
1. Wait for rate limit window (1 minute)
2. Reduce request frequency
3. For development, set `RATE_LIMIT_ENABLED=false`

### 500 Internal Server Error

**Symptom**: Server error response

**Solution**:
1. Check server logs: `firebase functions:log`
2. Verify database connectivity
3. Check for missing environment variables

---

## Payment Issues

### Stripe Checkout Fails

**Symptom**: Cannot complete checkout

**Solution**:
1. Verify `STRIPE_SECRET_KEY` is set
2. Check Stripe Dashboard for errors
3. Use test mode keys in development
4. Verify webhook endpoint configured

### Webhook Not Receiving

**Symptom**: Orders not created after payment

**Solution**:
```bash
# Test webhook endpoint
curl -X POST http://localhost:8080/webhooks/stripe \
  -H "Stripe-Signature: test"

# Check Stripe webhook logs in Dashboard
```

---

## AI Issues

### Suggestions Not Working

**Symptom**: No AI layout suggestions

**Solution**:
1. Verify `GEMINI_API_KEY` is set
2. Check daily budget not exceeded
3. Verify `FEATURE_AI_ENABLED=true`

### AI Rate Limited

**Symptom**: AI requests failing

**Solution**:
1. Check rate limits in logs
2. Reduce request frequency
3. Wait for limit reset

---

## Upload Issues

### File Upload Fails

**Symptom**: Cannot upload 3D models

**Solution**:
1. Check file size (max 100MB)
2. Verify file format (STL, OBJ, 3MF)
3. Check storage permissions
4. Verify `STORAGE_BUCKET` configured

### Upload Stuck at 0%

**Symptom**: Progress not moving

**Solution**:
1. Check network connection
2. Verify CORS configuration
3. Check storage quotas

---

## Performance Issues

### Slow Page Load

**Symptom**: Pages load slowly

**Solution**:
1. Enable CDN (`CDN_BASE_URL`)
2. Check server cold starts
3. Optimize images
4. Enable caching

### High Memory Usage

**Symptom**: Container using too much memory

**Solution**:
```bash
# Check memory
docker stats

# Increase limits in docker-compose.yml
# Optimize code for memory leaks
```

---

## Getting Help

### Logs to Collect

When reporting issues, include:
1. Error message (full stack trace)
2. Steps to reproduce
3. Environment (local/staging/production)
4. Relevant logs

### Support Channels

| Channel | Response Time |
|---------|---------------|
| GitHub Issues | 2-3 business days |
| Email support | 1 business day |
| Stack Overflow | Community |

---

## Related

- [Installation Guide](./installation-guide.md)
- [Configuration Reference](./configuration-reference.md)
- [Runbook Index](./runbook-index.md)
