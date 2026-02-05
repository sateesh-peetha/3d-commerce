/**
 * Cost Regression Check Script
 * Detects expensive patterns and potential abuse vectors
 * 
 * Usage: npm run check:cost-regression
 */

import * as fs from 'fs';
import * as path from 'path';

interface CostViolation {
    id: string;
    file: string;
    line: number;
    pattern: string;
    severity: 'BLOCKING' | 'WARNING';
}

const SRC_PATH = path.join(__dirname, '../src');
const RULES_PATH = path.join(__dirname, '../contracts/cost-regression-rules.json');

const COST_PATTERNS = [
    {
        id: 'COST-001',
        name: 'Unbounded Loop',
        pattern: /while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/g,
        severity: 'BLOCKING' as const
    },
    {
        id: 'COST-002',
        name: 'Query in Loop',
        pattern: /for\s*\([^)]*\)\s*\{[^}]*(getDoc|getDocs|query)\s*\(/gs,
        severity: 'WARNING' as const
    },
    {
        id: 'COST-003',
        name: 'AI Call in Loop',
        pattern: /for\s*\([^)]*\)\s*\{[^}]*(generateLayout|aiCall|openai)/gs,
        severity: 'BLOCKING' as const
    },
    {
        id: 'COST-005',
        name: 'setInterval without cleanup',
        pattern: /setInterval\s*\([^)]*\)(?![^}]*clearInterval)/gs,
        severity: 'WARNING' as const
    },
    {
        id: 'COST-007',
        name: 'Collection query without limit',
        pattern: /getDocs\s*\(\s*collection\s*\([^)]*\)\s*\)(?![^;]*limit)/gs,
        severity: 'BLOCKING' as const
    }
];

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

function checkFile(filePath: string): CostViolation[] {
    const violations: CostViolation[] = [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const rule of COST_PATTERNS) {
        let match;
        while ((match = rule.pattern.exec(content)) !== null) {
            // Find line number
            const beforeMatch = content.substring(0, match.index);
            const lineNumber = beforeMatch.split('\n').length;

            violations.push({
                id: rule.id,
                file: filePath,
                line: lineNumber,
                pattern: rule.name,
                severity: rule.severity
            });
        }
        // Reset regex
        rule.pattern.lastIndex = 0;
    }

    return violations;
}

async function main() {
    console.log('💰 Checking for Cost Regression Patterns...\n');

    const files = findFiles(SRC_PATH, '.ts').concat(findFiles(SRC_PATH, '.tsx'));
    const allViolations: CostViolation[] = [];

    for (const file of files) {
        const violations = checkFile(file);
        allViolations.push(...violations);
    }

    const blocking = allViolations.filter(v => v.severity === 'BLOCKING');
    const warnings = allViolations.filter(v => v.severity === 'WARNING');

    if (blocking.length > 0) {
        console.log('❌ BLOCKING VIOLATIONS:\n');
        for (const v of blocking) {
            console.log(`  ${v.id}: ${v.pattern}`);
            console.log(`    File: ${v.file}:${v.line}\n`);
        }
    }

    if (warnings.length > 0) {
        console.log('⚠️ WARNINGS:\n');
        for (const v of warnings) {
            console.log(`  ${v.id}: ${v.pattern}`);
            console.log(`    File: ${v.file}:${v.line}\n`);
        }
    }

    const report = {
        timestamp: new Date().toISOString(),
        blocking_count: blocking.length,
        warning_count: warnings.length,
        violations: allViolations
    };

    const outputPath = path.join(__dirname, '../outputs/cost-regression-report.json');
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

    if (blocking.length > 0) {
        console.log(`\n❌ BUILD FAILED: ${blocking.length} blocking cost violations found`);
        process.exit(1);
    } else if (warnings.length > 0) {
        console.log(`\n⚠️ BUILD PASSED WITH ${warnings.length} WARNINGS`);
        process.exit(0);
    } else {
        console.log('\n✅ NO COST REGRESSION PATTERNS DETECTED');
        process.exit(0);
    }
}

main().catch((err: Error) => {
    console.error('Error running cost regression check:', err);
    process.exit(1);
});
