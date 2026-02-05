# Upload Failures Runbook

## Symptoms
- File upload success rate < 90%
- Users reporting "upload failed" errors
- Storage health check failing
- Large files timing out
- Alert: UPLOAD001 triggered

## Immediate Actions (First 5 Minutes)

### 1. Check Storage Health
```bash
# Test storage accessibility
curl -I https://storage.googleapis.com/3dcommerce-3d-models/

# Check GCP Storage status
```

### 2. Check Upload Logs
```bash
# Recent upload failures
gcloud logging read 'jsonPayload.category="upload" AND jsonPayload.status="failure"' --limit=50

# Check for patterns:
# - File size issues
# - File type rejections
# - Timeout errors
# - Permission errors
```

### 3. Verify Storage Configuration
- Check bucket permissions
- Verify CORS configuration
- Check signed URL generation

### 4. Check for Client-Side Issues
- Browser console errors?
- Network connectivity issues?
- Specific file types failing?

## Quick Diagnostics

### File Size Issues
```bash
# Check recent file sizes
# Are failures only for large files?
# Check upload size limit configuration
```

### Permission Issues
```bash
# Verify service account permissions
gcloud projects get-iam-policy 3dcommerce-prod

# Check bucket-level permissions
gsutil iam get gs://3dcommerce-3d-models
```

### Signed URL Issues
```bash
# Test signed URL generation
# Check if URLs are expiring too quickly
# Verify signing key is valid
```

## Common Causes and Fixes

### 1. Bucket Permissions Changed
- Restore correct IAM permissions
- Verify service account has storage.objects.create

### 2. CORS Configuration Invalid
```json
// Required CORS config
[{
  "origin": ["https://3dcommerce.example.com"],
  "method": ["PUT", "POST"],
  "responseHeader": ["Content-Type"],
  "maxAgeSeconds": 3600
}]
```

### 3. File Too Large
- Check if file exceeds 100MB limit
- Guide user to compress or reduce file size

### 4. Invalid File Type
- Only allow: .stl, .obj, .3mf, .gcode
- Check file extension and MIME type

### 5. Network Timeout
- Large files on slow connections
- Consider resumable uploads

## Escalation Steps

### If storage completely unavailable:
1. Check GCP status page
2. If regional issue, consider backup region
3. Enable "upload later" queue

### If configuration was changed:
1. Identify who made the change
2. Restore previous configuration
3. Audit access to storage settings

## Recovery Verification

After issue resolved:

- [ ] Small file upload: successful
- [ ] Large file upload (50MB): successful
- [ ] Storage health check: passing
- [ ] Upload success rate: > 99%
- [ ] No orphaned partial uploads

## Prevention

- Monitor storage health continuously
- Alert on permission changes
- Test uploads as part of deployment verification

---
**Last Updated:** 2026-02-05
**Owner:** Storage Team
