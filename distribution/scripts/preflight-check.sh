#!/bin/bash
# 3D Commerce - Pre-flight Check Script
# Usage: ./preflight-check.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo "================================================"
echo "3D Commerce Platform - Pre-flight Checks"
echo "================================================"
echo ""

# System requirements
echo "Checking system requirements..."

# Node.js version
NODE_MIN_VERSION="20"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge "$NODE_MIN_VERSION" ]; then
        echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"
    else
        echo -e "${RED}✗ Node.js version too old. Required: $NODE_MIN_VERSION+, Found: $(node -v)${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗ Node.js not installed${NC}"
    ((ERRORS++))
fi

# npm
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓ npm: $(npm -v)${NC}"
else
    echo -e "${RED}✗ npm not installed${NC}"
    ((ERRORS++))
fi

# Docker (optional)
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker: $(docker --version | awk '{print $3}')${NC}"
else
    echo -e "${YELLOW}⚠ Docker not installed (optional for container deployment)${NC}"
    ((WARNINGS++))
fi

# Firebase CLI
if command -v firebase &> /dev/null; then
    echo -e "${GREEN}✓ Firebase CLI: $(firebase --version)${NC}"
else
    echo -e "${YELLOW}⚠ Firebase CLI not installed${NC}"
    ((WARNINGS++))
fi

# Git (optional)
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓ Git: $(git --version | awk '{print $3}')${NC}"
else
    echo -e "${YELLOW}⚠ Git not installed${NC}"
    ((WARNINGS++))
fi

echo ""

# Check disk space
echo "Checking disk space..."
REQUIRED_SPACE_MB=2048
AVAILABLE_SPACE=$(df -m . | awk 'NR==2 {print $4}')
if [ "$AVAILABLE_SPACE" -ge "$REQUIRED_SPACE_MB" ]; then
    echo -e "${GREEN}✓ Disk space: ${AVAILABLE_SPACE}MB available${NC}"
else
    echo -e "${RED}✗ Insufficient disk space. Required: ${REQUIRED_SPACE_MB}MB, Available: ${AVAILABLE_SPACE}MB${NC}"
    ((ERRORS++))
fi

echo ""

# Check network connectivity
echo "Checking network connectivity..."

# npm registry
if curl -s --head https://registry.npmjs.org | head -n 1 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ npm registry accessible${NC}"
else
    echo -e "${RED}✗ Cannot reach npm registry${NC}"
    ((ERRORS++))
fi

# Firebase
if curl -s --head https://firebase.google.com | head -n 1 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ Firebase accessible${NC}"
else
    echo -e "${YELLOW}⚠ Cannot reach Firebase (may require VPN)${NC}"
    ((WARNINGS++))
fi

echo ""

# Check for required files
echo "Checking required files..."

REQUIRED_FILES=(
    "package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file exists${NC}"
    else
        echo -e "${RED}✗ $file not found${NC}"
        ((ERRORS++))
    fi
done

echo ""

# Summary
echo "================================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}Pre-flight checks passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
    fi
    exit 0
else
    echo -e "${RED}Pre-flight checks failed!${NC}"
    echo "Errors: $ERRORS"
    echo "Warnings: $WARNINGS"
    exit 1
fi
