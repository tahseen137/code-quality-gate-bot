"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCoverage = checkCoverage;
const fs = __importStar(require("fs"));
async function checkCoverage(coverageReportPath, threshold = 70) {
    try {
        if (!fs.existsSync(coverageReportPath)) {
            return {
                passed: false,
                coverage: 0,
                threshold,
                message: `Coverage report not found at ${coverageReportPath}`,
            };
        }
        const reportContent = fs.readFileSync(coverageReportPath, 'utf-8');
        const coverage = parseCoverageReport(reportContent, coverageReportPath);
        const passed = coverage >= threshold;
        return {
            passed,
            coverage,
            threshold,
            message: passed
                ? `✅ Coverage: ${coverage}% (threshold: ${threshold}%)`
                : `❌ Coverage: ${coverage}% (threshold: ${threshold}%)`,
        };
    }
    catch (error) {
        return {
            passed: false,
            coverage: 0,
            threshold,
            message: `Error checking coverage: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}
function parseCoverageReport(content, filePath) {
    // Parse Jacoco XML (Java)
    if (filePath.endsWith('.xml')) {
        return parseJacocoXml(content);
    }
    // Parse coverage.json (from Jest/Vitest)
    try {
        const json = JSON.parse(content);
        if (json.total?.lines?.pct) {
            return Math.round(json.total.lines.pct);
        }
    }
    catch {
        // Not JSON, try text format
    }
    // Parse text-based coverage report (e.g., from lcov)
    const match = content.match(/Lines\s*:\s*([\d.]+)%/);
    if (match) {
        return Math.round(parseFloat(match[1]));
    }
    return 0;
}
function parseJacocoXml(content) {
    try {
        // Extract line coverage from Jacoco XML
        // Format: <counter type="LINE" missed="10" covered="90"/>
        const lineMatch = content.match(/<counter type="LINE" missed="(\d+)" covered="(\d+)"/);
        if (lineMatch) {
            const missed = parseInt(lineMatch[1], 10);
            const covered = parseInt(lineMatch[2], 10);
            const total = missed + covered;
            if (total > 0) {
                return Math.round((covered / total) * 100);
            }
        }
    }
    catch {
        // Ignore parsing errors
    }
    return 0;
}
//# sourceMappingURL=coverage-checker.js.map