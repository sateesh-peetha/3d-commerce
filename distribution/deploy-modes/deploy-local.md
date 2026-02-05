# Local Deployment Guide

Deploy 3D Commerce locally using Docker Compose.

## Prerequisites

- Docker 24.x or later
- Docker Compose 2.x or later
- 4GB RAM minimum
- 10GB disk space

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/org/3dcommerce.git
cd 3dcommerce

# 2. Copy environment file
cp distribution/docker/.env.example distribution/docker/.env.local

# 3. Edit environment variables
# Fill in required values in .env.local

# 4. Start services
cd distribution
docker-compose up -d

# 5. Verify health
curl http://localhost:8080/api/health
```

## Environment Variables

Create `.env.local` with:

```bash
# Required
RUN_MODE=development
FIREBASE_PROJECT_ID=demo-3dcommerce

# For Firebase emulators
FIRESTORE_EMULATOR_HOST=firebase-emulators:8080
FIREBASE_AUTH_EMULATOR_HOST=firebase-emulators:9099
FIREBASE_STORAGE_EMULATOR_HOST=firebase-emulators:9199
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Web application |
| Backend | 8080 | API server |
| Firebase UI | 4000 | Emulator dashboard |
| Firestore | 8082 | Database emulator |
| Auth | 9099 | Auth emulator |
| Storage | 9199 | Storage emulator |

## Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Reset data (destructive)
docker-compose down -v
```

## Health Checks

- Frontend: http://localhost:3000/health
- Backend: http://localhost:8080/api/health
- Emulator UI: http://localhost:4000

## Troubleshooting

### Port conflicts
```bash
# Check what's using a port
lsof -i :8080

# Use different ports
PORT=9000 docker-compose up -d
```

### Out of memory
Increase Docker Desktop memory allocation to 4GB+.

### Build failures
```bash
# Clean build
docker-compose build --no-cache
```
