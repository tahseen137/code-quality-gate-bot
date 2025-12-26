import * as github from '@actions/github';
import { CoverageResult } from './coverage-checker';
import { LintResult } from './lint-checker';
import { TypeCheckResult } from './type-checker';

export interface QualityCheckResults {
  coverage: CoverageResult;
  lint: LintResult;
  typeCheck: TypeCheckResult;
}

export async function postPRComment(
  token: string,
  results: QualityCheckResults
): Promise<void> {
  const octokit = github.getOctokit(token);
  const context = github.context;

  if (!context.payload.pull_request) {
    console.log('Not a pull request, skipping comment');
    return;
  }

  const allPassed = results.coverage.passed && results.lint.passed && results.typeCheck.passed;

  const comment = buildComment(results, allPassed);

  await octokit.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request.number,
    body: comment,
  });
}

function buildComment(results: QualityCheckResults, allPassed: boolean): string {
  const status = allPassed ? '✅ PASSED' : '❌ FAILED';

  return `## Code Quality Gate ${status}

### Coverage
${results.coverage.message}

### Linting
${results.lint.message}

### Type Checking
${results.typeCheck.message}

---
${allPassed ? '**All quality gates passed!** 🎉' : '**Please fix the issues above before merging.**'}
`;
}

export async function setCheckStatus(
  token: string,
  results: QualityCheckResults
): Promise<void> {
  const octokit = github.getOctokit(token);
  const context = github.context;

  const allPassed = results.coverage.passed && results.lint.passed && results.typeCheck.passed;

  await octokit.rest.checks.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    name: 'Code Quality Gate',
    head_sha: context.payload.pull_request?.head.sha || context.sha,
    status: 'completed',
    conclusion: allPassed ? 'success' : 'failure',
    output: {
      title: 'Code Quality Gate',
      summary: allPassed ? 'All quality gates passed' : 'Quality gate checks failed',
      text: buildComment(results, allPassed),
    },
  });
}
