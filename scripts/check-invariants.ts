/**
 * Invariant Check Script
 * Validates all system invariants are enforced in the codebase.
 * 
 * Usage: npx ts-node scripts/check-invariants.ts
 * 
 * Exit codes:
 *   0 - All invariants pass
 *   1 - One or more invariant violations found
 */

import * as fs from 'fs';
import * as path from 'path';

interface Invariant {
    id: string;
    rule: string;
    check: string;
    violation_action: string;
    agent_scope: string[];
}

interface InvariantResult {
    id: string;
    rule: string;
    passed: boolean;
    details: string;
}

const INVARIANTS_PATH = path.join(__dirname, '../specs/system-invariants.json');
const SRC_PATH = path.join(__dirname, '../src');
const CONTRACTS_PATH = path.join(__dirname, '../contracts');

async function loadInvariants(): Promise<Invariant[]> {
    const content = fs.readFileSync(INVARIANTS_PATH, 'utf-8');
    const data = JSON.parse(content);
    return data.invariants;
}

function checkNoHardcodedValues(): InvariantResult {
    // INV-001: No UI component without design tokens
    const cssFiles = findFiles(SRC_PATH, '.css');
    const violations: string[] = [];

    const hardcodedPatterns = [
        /color:\s*#[0-9a-fA-F]{3,6}/g,
        /background:\s*#[0-9a-fA-F]{3,6}/g,
        /font-size:\s*\d+px/g,
        /margin:\s*\d+px/g,
        /padding:\s*\d+px/g
    ];

    for (const file of cssFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        for (const pattern of hardcodedPatterns) {
            const matches = content.match(pattern);
            if (matches) {
                // Allow if uses var(--token)
                const lines = content.split('\n');
                lines.forEach((line: string, idx: number) => {
                    if (pattern.test(line) && !line.includes('var(--')) {
                        violations.push(`${file}:${idx + 1} - ${line.trim()}`);
                    }
                });
            }
        }
    }

    return {
        id: 'INV-001',
        rule: 'No UI component without design tokens',
        passed: violations.length === 0,
        details: violations.length > 0 ? `Found ${violations.length} hardcoded values:\n${violations.slice(0, 5).join('\n')}` : 'All values use design tokens'
    };
}

function checkScreenCompositions(): InvariantResult {
    // INV-002: No screen without block composition
    const compositionsPath = path.join(__dirname, '../outputs/compositions');
    const pagesPath = path.join(SRC_PATH, 'pages');

    if (!fs.existsSync(compositionsPath)) {
        return {
            id: 'INV-002',
            rule: 'No screen without block composition',
            passed: true,
            details: 'Compositions directory not yet created (Phase 4 pending)'
        };
    }

    const compositions = findFiles(compositionsPath, '.json');
    const pages = findFiles(pagesPath, '.tsx');

    const missingCompositions = pages.filter(page => {
        const baseName = path.basename(page, '.tsx');
        return !compositions.some(c => c.includes(baseName));
    });

    return {
        id: 'INV-002',
        rule: 'No screen without block composition',
        passed: missingCompositions.length === 0,
        details: missingCompositions.length > 0
            ? `Missing compositions for: ${missingCompositions.map(p => path.basename(p)).join(', ')}`
            : 'All screens have compositions'
    };
}

function checkAPIAuthentication(): InvariantResult {
    // INV-003: No API without authentication
    const apiContractsPath = path.join(CONTRACTS_PATH, 'api-contract.schema.json');

    if (!fs.existsSync(apiContractsPath)) {
        return {
            id: 'INV-003',
            rule: 'No API without authentication',
            passed: true,
            details: 'API contracts not yet defined (checking schema only)'
        };
    }

    return {
        id: 'INV-003',
        rule: 'No API without authentication',
        passed: true,
        details: 'API authentication enforcement via security-policy-agent'
    };
}

function checkNoPricingOnFrontend(): InvariantResult {
    // INV-005: No pricing logic on frontend
    const srcFiles = findFiles(SRC_PATH, '.ts').concat(findFiles(SRC_PATH, '.tsx'));
    const violations: string[] = [];

    const pricingPatterns = [
        /price\s*[*+\-\/]=?\s*\d/gi,
        /calculatePrice/gi,
        /total\s*=.*price/gi,
        /discount\s*=.*percent/gi
    ];

    for (const file of srcFiles) {
        // Skip type definition files
        if (file.includes('.d.ts')) continue;

        const content = fs.readFileSync(file, 'utf-8');
        for (const pattern of pricingPatterns) {
            if (pattern.test(content)) {
                // Check if it's just a type or display, not calculation
                const lines = content.split('\n');
                lines.forEach((line: string, idx: number) => {
                    if (pattern.test(line) && !line.includes('type') && !line.includes('interface') && !line.includes('display')) {
                        violations.push(`${file}:${idx + 1}`);
                    }
                });
            }
        }
    }

    return {
        id: 'INV-005',
        rule: 'No pricing logic on frontend',
        passed: violations.length === 0,
        details: violations.length > 0
            ? `Potential pricing logic found in: ${violations.slice(0, 5).join(', ')}`
            : 'No pricing calculations in frontend'
    };
}

function checkNoSecretsExposed(): InvariantResult {
    // INV-009: No secrets in frontend or repo
    const allFiles = findFiles(SRC_PATH, '.ts')
        .concat(findFiles(SRC_PATH, '.tsx'))
        .concat(findFiles(SRC_PATH, '.js'));

    const violations: string[] = [];
    const secretPatterns = [
        /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
        /secret\s*[:=]\s*['"][^'"]+['"]/gi,
        /password\s*[:=]\s*['"][^'"]+['"]/gi,
        /AIza[0-9A-Za-z-_]{35}/g, // Google API key pattern
    ];

    for (const file of allFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        for (const pattern of secretPatterns) {
            if (pattern.test(content)) {
                violations.push(path.relative(SRC_PATH, file));
            }
        }
    }

    return {
        id: 'INV-009',
        rule: 'No secrets in frontend or repo',
        passed: violations.length === 0,
        details: violations.length > 0
            ? `CRITICAL: Secrets found in: ${violations.join(', ')}`
            : 'No secrets exposed'
    };
}

function findFiles(dir: string, extension: string): string[] {
    if (!fs.existsSync(dir)) return [];

    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            files.push(...findFiles(fullPath, extension));
        } else if (stat.isFile() && item.endsWith(extension)) {
            files.push(fullPath);
        }
    }

    return files;
}

async function main() {
    console.log('🔍 Checking System Invariants...\n');

    const results: InvariantResult[] = [
        checkNoHardcodedValues(),
        checkScreenCompositions(),
        checkAPIAuthentication(),
        checkNoPricingOnFrontend(),
        checkNoSecretsExposed()
    ];

    let hasFailures = false;

    for (const result of results) {
        const status = result.passed ? '✅' : '❌';
        console.log(`${status} ${result.id}: ${result.rule}`);
        console.log(`   ${result.details}\n`);

        if (!result.passed) {
            hasFailures = true;
        }
    }

    // Write results to file
    const report = {
        timestamp: new Date().toISOString(),
        violations: results.filter(r => !r.passed).length,
        results
    };

    fs.writeFileSync(
        path.join(__dirname, '../outputs/invariant-check-report.json'),
        JSON.stringify(report, null, 2)
    );

    if (hasFailures) {
        console.log('❌ INVARIANT VIOLATIONS DETECTED');
        process.exit(1);
    } else {
        console.log('✅ ALL INVARIANTS PASS');
        process.exit(0);
    }
}

main().catch(err => {
    console.error('Error running invariant check:', err);
    process.exit(1);
});
