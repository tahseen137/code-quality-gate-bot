import * as fs from 'fs';
import * as path from 'path';

export interface CoverageResult {
  passed: boolean;
  coverage: number;
  threshold: number;
  message: string;
}

export async function checkCoverage(
  coverageReportPath: string,
  threshold: number = 70
): Promise<CoverageResult> {
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
  } catch (error) {
    return {
      passed: false,
      coverage: 0,
      threshold,
      message: `Error checking coverage: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

function parseCoverageReport(content: string, filePath: string): number {
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
  } catch {
    // Not JSON, try text format
  }

  // Parse text-based coverage report (e.g., from lcov)
  const match = content.match(/Lines\s*:\s*([\d.]+)%/);
  if (match) {
    return Math.round(parseFloat(match[1]));
  }

  return 0;
}

function parseJacocoXml(content: string): number {
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
  } catch {
    // Ignore parsing errors
  }
  return 0;
}
