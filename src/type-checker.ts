import { execSync } from 'child_process';

export interface TypeCheckResult {
  passed: boolean;
  errors: number;
  message: string;
}

export async function checkTypes(workingDirectory: string = '.'): Promise<TypeCheckResult> {
  try {
    execSync('tsc --noEmit', {
      cwd: workingDirectory,
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    return {
      passed: true,
      errors: 0,
      message: '✅ No TypeScript errors found',
    };
  } catch (error) {
    const output = error instanceof Error ? error.toString() : 'Unknown error';
    const errorCount = (output.match(/error TS\d+:/g) || []).length;

    return {
      passed: false,
      errors: errorCount || 1,
      message: `❌ TypeScript errors found: ${errorCount || 1} error(s)`,
    };
  }
}
