import * as core from '@actions/core';
import { checkCoverage } from './coverage-checker';
import { checkLinting } from './lint-checker';
import { checkTypes } from './type-checker';
import { postPRComment, setCheckStatus } from './pr-commenter';

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token');
    const coverageThreshold = parseInt(core.getInput('coverage-threshold') || '70', 10);
    const coverageReportPath = core.getInput('coverage-report-path') || 'coverage/coverage-final.json';

    core.info('Starting code quality gate checks...');

    // Run all checks in parallel
    const [coverage, lint, typeCheck] = await Promise.all([
      checkCoverage(coverageReportPath, coverageThreshold),
      checkLinting(),
      checkTypes(),
    ]);

    const results = { coverage, lint, typeCheck };

    // Post results to PR
    await postPRComment(token, results);
    await setCheckStatus(token, results);

    // Log results
    core.info(`Coverage: ${coverage.message}`);
    core.info(`Linting: ${lint.message}`);
    core.info(`Type Check: ${typeCheck.message}`);

    // Fail if any check failed
    const allPassed = coverage.passed && lint.passed && typeCheck.passed;
    if (!allPassed) {
      core.setFailed('Code quality gate checks failed');
    } else {
      core.info('✅ All quality gates passed!');
    }
  } catch (error) {
    core.setFailed(`Action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

run();
