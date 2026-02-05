#!/bin/bash
# 3D Commerce - Environment Validation Script
# Called at container startup to validate environment

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Validating environment..."

ERRORS=0

# Required environment variables
REQUIRED_VARS=(
    "RUN_MODE"
    "FIREBASE_PROJECT_ID"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var:-}" ]; then
        echo -e "${RED}✗ Missing required variable: $var${NC}"
        ((ERRORS++))
    fi
done

# Validate RUN_MODE
if [ -n "${RUN_MODE:-}" ]; then
    case "$RUN_MODE" in
        development|staging|production)
            echo -e "${GREEN}✓ RUN_MODE: $RUN_MODE${NC}"
            ;;
        *)
            echo -e "${RED}✗ Invalid RUN_MODE: $RUN_MODE (must be development, staging, or production)${NC}"
            ((ERRORS++))
            ;;
    esac
fi

# Production-specific checks
if [ "${RUN_MODE:-}" == "production" ]; then
    PROD_REQUIRED=(
        "STRIPE_SECRET_KEY"
        "STRIPE_WEBHOOK_SECRET"
    )
    
    for var in "${PROD_REQUIRED[@]}"; do
        if [ -z "${!var:-}" ]; then
            echo -e "${RED}✗ Production requires: $var${NC}"
            ((ERRORS++))
        fi
    done
fi

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}Environment validation passed${NC}"
    exit 0
else
    echo -e "${RED}Environment validation failed with $ERRORS errors${NC}"
    exit 1
fi
