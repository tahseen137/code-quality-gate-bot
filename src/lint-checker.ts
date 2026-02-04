import { execSync } from 'child_process';

export interface LintResult {
  passed: boolean;
  errors: number;
  warnings: number;
  message: string;
}

export async function checkLinting(workingDirectory: string = '.'): Promise<LintResult> {
  try {
    execSync('eslint . --format json --max-warnings 0', {
      cwd: workingDirectory,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return {
      passed: true,
      errors: 0,
      warnings: 0,
      message: '✅ No linting errors found',
    };
  } catch (error) {
    if (error instanceof Error && 'stdout' in error) {
      try {
        const results = JSON.parse((error as any).stdout || '[]');
        const totalErrors = results.reduce((sum: number, file: any) => sum + (file.errorCount || 0), 0);
        const totalWarnings = results.reduce((sum: number, file: any) => sum + (file.warningCount || 0), 0);

        return {
          passed: totalErrors === 0,
          errors: totalErrors,
          warnings: totalWarnings,
          message:
            totalErrors > 0
              ? `❌ Linting failed: ${totalErrors} error(s), ${totalWarnings} warning(s)`
              : `⚠️ Linting warnings: ${totalWarnings}`,
        };
      } catch {
        return {
          passed: false,
          errors: 1,
          warnings: 0,
          message: '❌ Failed to parse linting results',
        };
      }
    }

    return {
      passed: false,
      errors: 1,
      warnings: 0,
      message: `❌ Linting check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
