#!/bin/bash
# 3D Commerce - Rollback Script
# Usage: ./rollback.sh [backup_dir]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKUP_DIR="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "================================================"
echo "3D Commerce Platform - Rollback"
echo "================================================"

# Find backup to restore
if [ -z "$BACKUP_DIR" ]; then
    # Find most recent backup
    BACKUP_DIR=$(ls -dt "$SCRIPT_DIR/../backups"/*/ 2>/dev/null | head -1)
    if [ -z "$BACKUP_DIR" ]; then
        echo -e "${RED}✗ No backup found to rollback to${NC}"
        exit 1
    fi
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}✗ Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

echo "Rolling back to: $BACKUP_DIR"

# Confirm rollback
read -p "Are you sure you want to rollback? This will overwrite current configuration. (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled."
    exit 0
fi

# Create emergency backup of current state
EMERGENCY_BACKUP="$SCRIPT_DIR/../backups/emergency_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$EMERGENCY_BACKUP"
cp package.json "$EMERGENCY_BACKUP/" 2>/dev/null || true
cp .env.* "$EMERGENCY_BACKUP/" 2>/dev/null || true
echo -e "${GREEN}✓ Emergency backup created: $EMERGENCY_BACKUP${NC}"

# Restore package.json
echo ""
echo "Restoring package.json..."
if [ -f "$BACKUP_DIR/package.json" ]; then
    cp "$BACKUP_DIR/package.json" ./
    echo -e "${GREEN}✓ package.json restored${NC}"
fi

# Restore configuration
echo ""
echo "Restoring configuration..."
for env_file in "$BACKUP_DIR"/.env.*; do
    if [ -f "$env_file" ]; then
        cp "$env_file" ./
        echo -e "${GREEN}✓ $(basename "$env_file") restored${NC}"
    fi
done

# Restore Firestore rules
if [ -f "$BACKUP_DIR/firestore.rules" ]; then
    cp "$BACKUP_DIR/firestore.rules" ./
    echo -e "${GREEN}✓ firestore.rules restored${NC}"
fi

if [ -f "$BACKUP_DIR/storage.rules" ]; then
    cp "$BACKUP_DIR/storage.rules" ./
    echo -e "${GREEN}✓ storage.rules restored${NC}"
fi

# Reinstall dependencies
echo ""
echo "Reinstalling dependencies..."
npm ci

# Rebuild
echo ""
echo "Rebuilding application..."
npm run build

# Redeploy
echo ""
echo "Redeploying..."
source .env.production 2>/dev/null || source .env

firebase deploy --only functions,firestore:rules,storage:rules

# Verify rollback
echo ""
echo "Verifying rollback..."
"$SCRIPT_DIR/validate-install.sh" production

echo ""
echo "================================================"
echo -e "${GREEN}Rollback Complete!${NC}"
echo "Restored from: $BACKUP_DIR"
echo "Emergency backup: $EMERGENCY_BACKUP"
echo "================================================"
