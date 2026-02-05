#!/bin/bash
# 3D Commerce - Upgrade Script
# Usage: ./upgrade.sh [from_version] [to_version]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FROM_VERSION="${1:-}"
TO_VERSION="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/../backups/$(date +%Y%m%d_%H%M%S)"

echo "================================================"
echo "3D Commerce Platform - Upgrade"
echo "From: ${FROM_VERSION:-current}"
echo "To: ${TO_VERSION:-latest}"
echo "================================================"

# Pre-upgrade checks
echo ""
echo "Running pre-upgrade checks..."

# Check current version
CURRENT_VERSION=$(cat package.json | grep '"version"' | head -1 | awk -F'"' '{print $4}')
echo "Current installed version: $CURRENT_VERSION"

# Validate upgrade path
if [ -n "$FROM_VERSION" ] && [ "$FROM_VERSION" != "$CURRENT_VERSION" ]; then
    echo -e "${YELLOW}⚠ Warning: Current version ($CURRENT_VERSION) differs from expected ($FROM_VERSION)${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create backup
echo ""
echo "Creating backup..."
mkdir -p "$BACKUP_DIR"

# Backup package files
cp package.json "$BACKUP_DIR/"
cp package-lock.json "$BACKUP_DIR/" 2>/dev/null || true

# Backup configuration
cp .env.* "$BACKUP_DIR/" 2>/dev/null || true

# Backup Firestore rules
cp firestore.rules "$BACKUP_DIR/" 2>/dev/null || true
cp storage.rules "$BACKUP_DIR/" 2>/dev/null || true

echo -e "${GREEN}✓ Backup created: $BACKUP_DIR${NC}"

# Check for breaking changes
echo ""
echo "Checking for breaking changes..."

BREAKING_CHANGES_FILE="$SCRIPT_DIR/../migrations/breaking-changes.json"
if [ -f "$BREAKING_CHANGES_FILE" ]; then
    # Check if migration is needed
    echo "Checking migration requirements..."
fi

# Stop services (if running)
echo ""
echo "Preparing for upgrade..."

# Pull latest code (if git)
if [ -d ".git" ]; then
    echo "Pulling latest changes..."
    git fetch origin
    if [ -n "$TO_VERSION" ]; then
        git checkout "v$TO_VERSION" 2>/dev/null || git checkout "$TO_VERSION"
    else
        git pull origin main
    fi
fi

# Install new dependencies
echo ""
echo "Installing dependencies..."
npm ci

# Run migrations
echo ""
echo "Running database migrations..."
MIGRATIONS_DIR="$SCRIPT_DIR/../migrations"
if [ -d "$MIGRATIONS_DIR" ]; then
    for migration in "$MIGRATIONS_DIR"/*.js; do
        if [ -f "$migration" ]; then
            MIGRATION_NAME=$(basename "$migration")
            echo "Running migration: $MIGRATION_NAME"
            node "$migration" || {
                echo -e "${RED}✗ Migration failed: $MIGRATION_NAME${NC}"
                echo "Rolling back..."
                "$SCRIPT_DIR/rollback.sh" "$BACKUP_DIR"
                exit 1
            }
        fi
    done
fi

# Build application
echo ""
echo "Building application..."
npm run build

# Deploy
echo ""
echo "Deploying..."
source .env.production 2>/dev/null || source .env

firebase deploy --only functions,firestore:rules,storage:rules

# Verify upgrade
echo ""
echo "Verifying upgrade..."
"$SCRIPT_DIR/validate-install.sh" production

# Cleanup old backups (keep last 5)
echo ""
echo "Cleaning up old backups..."
ls -dt "$SCRIPT_DIR/../backups"/*/ 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true

echo ""
echo "================================================"
echo -e "${GREEN}Upgrade Complete!${NC}"
echo "New version: $(cat package.json | grep '"version"' | head -1 | awk -F'"' '{print $4}')"
echo "Backup location: $BACKUP_DIR"
echo "================================================"
