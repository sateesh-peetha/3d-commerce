#!/bin/bash
# 3D Commerce - Installation Script
# Usage: ./install.sh [environment]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ENVIRONMENT="${1:-development}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "================================================"
echo "3D Commerce Platform - Installation"
echo "Environment: $ENVIRONMENT"
echo "================================================"

# Pre-flight checks
echo ""
echo "Running pre-flight checks..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js 20.x${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm: $NPM_VERSION${NC}"

# Check Docker (optional for local dev)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker: $DOCKER_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Docker not found (optional for non-container deployment)${NC}"
fi

# Check Firebase CLI
if command -v firebase &> /dev/null; then
    echo -e "${GREEN}✓ Firebase CLI installed${NC}"
else
    echo -e "${YELLOW}⚠ Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
fi

# Validate environment file
echo ""
echo "Checking environment configuration..."

ENV_FILE=".env.${ENVIRONMENT}"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠ Environment file not found: $ENV_FILE${NC}"
    echo "Creating from template..."
    cp .env.example "$ENV_FILE"
    echo -e "${YELLOW}⚠ Please edit $ENV_FILE with your configuration${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Environment file: $ENV_FILE${NC}"

# Load environment
set -a
source "$ENV_FILE"
set +a

# Validate required variables
echo ""
echo "Validating required environment variables..."

REQUIRED_VARS=(
    "FIREBASE_PROJECT_ID"
    "STORAGE_BUCKET"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var:-}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}✗ Missing required variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    exit 1
fi
echo -e "${GREEN}✓ All required variables set${NC}"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm ci

# Build application
echo ""
echo "Building application..."
npm run build

# Deploy based on environment
if [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "staging" ]; then
    echo ""
    echo "Deploying to Firebase..."
    firebase use "$FIREBASE_PROJECT_ID"
    firebase deploy --only hosting,functions,firestore:rules,storage:rules
else
    echo ""
    echo "Development setup complete."
    echo "Run 'npm run dev' to start the development server."
fi

# Post-install verification
echo ""
echo "Running post-install verification..."
"$SCRIPT_DIR/validate-install.sh" "$ENVIRONMENT"

echo ""
echo "================================================"
echo -e "${GREEN}Installation Complete!${NC}"
echo "================================================"
