#!/bin/bash
# 3D Commerce - Installation Validation Script
# Usage: ./validate-install.sh [environment]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ENVIRONMENT="${1:-development}"
ERRORS=0

echo "================================================"
echo "3D Commerce Platform - Installation Validation"
echo "Environment: $ENVIRONMENT"
echo "================================================"
echo ""

# Load environment
if [ -f ".env.${ENVIRONMENT}" ]; then
    set -a
    source ".env.${ENVIRONMENT}"
    set +a
fi

# Check build artifacts
echo "Checking build artifacts..."

if [ -d "dist" ] || [ -d ".next" ] || [ -d "packages/web/dist" ]; then
    echo -e "${GREEN}✓ Build artifacts exist${NC}"
else
    echo -e "${RED}✗ Build artifacts not found${NC}"
    ((ERRORS++))
fi

# Check node_modules
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules installed${NC}"
else
    echo -e "${RED}✗ node_modules not found${NC}"
    ((ERRORS++))
fi

echo ""

# Test API health (if running)
echo "Testing API health..."

API_URL="${API_BASE_URL:-http://localhost:8080}"
HEALTH_ENDPOINT="$API_URL/api/health"

# Only test if server is expected to be running
if [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "staging" ]; then
    if curl -s --fail "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ API health check passed${NC}"
        
        # Parse health response
        HEALTH_RESPONSE=$(curl -s "$HEALTH_ENDPOINT")
        echo "  Response: $HEALTH_RESPONSE"
    else
        echo -e "${YELLOW}⚠ API health check failed (server may not be running)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Skipping API health check for development${NC}"
fi

echo ""

# Check configuration
echo "Validating configuration..."

# Required environment variables
REQUIRED_VARS=(
    "FIREBASE_PROJECT_ID"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -n "${!var:-}" ]; then
        echo -e "${GREEN}✓ $var is set${NC}"
    else
        echo -e "${RED}✗ $var is not set${NC}"
        ((ERRORS++))
    fi
done

# Check for secrets (should exist but we don't print values)
SECRET_VARS=(
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
)

for var in "${SECRET_VARS[@]}"; do
    if [ -n "${!var:-}" ]; then
        echo -e "${GREEN}✓ $var is configured${NC}"
    else
        if [ "$ENVIRONMENT" == "production" ]; then
            echo -e "${RED}✗ $var is required for production${NC}"
            ((ERRORS++))
        else
            echo -e "${YELLOW}⚠ $var not set (optional for $ENVIRONMENT)${NC}"
        fi
    fi
done

echo ""

# Verify no secrets in code
echo "Checking for secrets in code..."

PATTERNS=(
    "sk_live_"
    "sk_test_[a-zA-Z0-9]{20,}"
    "whsec_"
    "-----BEGIN PRIVATE KEY-----"
)

SECRETS_FOUND=0
for pattern in "${PATTERNS[@]}"; do
    if grep -rE "$pattern" --include="*.ts" --include="*.js" --include="*.json" \
       --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | grep -v "schema.json" | grep -v "example" | head -1; then
        SECRETS_FOUND=1
    fi
done

if [ $SECRETS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓ No secrets found in code${NC}"
else
    echo -e "${RED}✗ Potential secrets found in code!${NC}"
    ((ERRORS++))
fi

echo ""

# Summary
echo "================================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}Validation Passed!${NC}"
    echo "Installation is valid for: $ENVIRONMENT"
    exit 0
else
    echo -e "${RED}Validation Failed!${NC}"
    echo "Errors: $ERRORS"
    echo "Please fix the issues above before deploying."
    exit 1
fi
