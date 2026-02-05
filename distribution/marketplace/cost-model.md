# Cost Model

## Overview

This document outlines the expected costs for running 3D Commerce at various scales.

## Cost Components

### Fixed Costs (Per Month)

| Component | Provider | Estimated Cost | Notes |
|-----------|----------|----------------|-------|
| Firebase Spark Plan | Google | $0 | Free tier sufficient for dev |
| Firebase Blaze Plan | Google | Pay-as-you-go | Required for production |
| Domain | Various | $10-20/year | Optional custom domain |
| SSL Certificate | Firebase/GCP | $0 | Included |

### Variable Costs

#### Firebase/GCP

| Resource | Unit | Price | Free Tier |
|----------|------|-------|-----------|
| Hosting bandwidth | GB | $0.15 | 10 GB/month |
| Function invocations | Million | $0.40 | 2M/month |
| Function compute (GB-sec) | GB-second | $0.0000025 | 400K GB-sec |
| Firestore reads | 100K | $0.06 | 50K/day |
| Firestore writes | 100K | $0.18 | 20K/day |
| Firestore storage | GB | $0.18 | 1 GB |
| Cloud Storage | GB/month | $0.026 | 5 GB |
| Storage egress | GB | $0.12 | 1 GB/day |

#### Third-Party Services

| Service | Pricing Model | Typical Cost |
|---------|--------------|--------------|
| Stripe | 2.9% + $0.30 per txn | Varies by sales |
| AI (Gemini/OpenAI) | Per token | $25/day cap enforced |
| Error tracking (Sentry) | Per event | Free tier: 5K events |
| Analytics (GA4) | Free | $0 |

## Scaling Estimates

### Small (Hobby/MVP)
- **Users**: < 100 active
- **Orders**: < 100/month
- **Storage**: < 5 GB
- **Estimated monthly cost**: **$0-25**
- Firebase free tier covers most usage

### Medium (Growing Business)
- **Users**: 100-1,000 active
- **Orders**: 100-1,000/month
- **Storage**: 5-50 GB
- **Estimated monthly cost**: **$50-200**

| Component | Estimated |
|-----------|-----------|
| Firebase | $30-100 |
| AI usage | $25-75 |
| Stripe fees | Variable |

### Large (Established Business)
- **Users**: 1,000-10,000 active
- **Orders**: 1,000-10,000/month
- **Storage**: 50-500 GB
- **Estimated monthly cost**: **$200-1,000**

| Component | Estimated |
|-----------|-----------|
| Firebase | $100-400 |
| AI usage | $75-300 |
| Storage | $25-100 |
| Monitoring | $50-100 |

### Enterprise
- **Users**: 10,000+ active
- **Orders**: 10,000+/month
- **Estimated monthly cost**: **$1,000+**
- Contact for volume pricing and SLA

## Cost Optimization Tips

### Reduce Firebase Costs
1. Enable Firestore caching
2. Use compound queries to reduce reads
3. Paginate large lists
4. Use CDN caching for static assets

### Reduce AI Costs
1. Daily cost cap is enforced ($25 default)
2. Cache AI suggestions
3. Rate limit AI features per user
4. Disable AI for low-engagement users

### Reduce Storage Costs
1. Compress 3D models
2. Generate thumbnails at upload time
3. Set lifecycle rules for old files
4. Use regional storage for cost savings

## Cost Monitoring

Built-in features:
- AI cost tracking per day
- Budget alerts via GCP
- Usage dashboard in admin

Recommended setup:
1. Set GCP budget alerts at 50%, 80%, 100%
2. Monitor AI cost in admin dashboard
3. Review Stripe fees monthly

## Calculator

Use GCP Pricing Calculator for detailed estimates:
https://cloud.google.com/products/calculator

Or contact us for a customized estimate based on your expected usage.
