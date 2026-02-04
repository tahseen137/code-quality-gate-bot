import * as core from '@actions/core';
import { checkCoverage } from './coverage-checker';
import { checkLinting } from './lint-checker';
import { checkTypes } from './type-checker';
import { postPRComment, setCheckStatus } from './pr-commenter';
import { detectProjectType, ProjectType } from './project-detector';

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token');
    const coverageThreshold = parseInt(core.getInput('coverage-threshold') || '70', 10);
    const projectType = core.getInput('project-type') || 'auto';

    core.info('Starting code quality gate checks...');

    // Detect project type if auto
    let detectedType: ProjectType = 'nodejs';
    if (projectType === 'auto') {
      detectedType = detectProjectType();
      core.info(`Detected project type: ${detectedType}`);
    } else {
      detectedType = projectType as ProjectType;
    }

    // Determine coverage report path based on project type
    let coverageReportPath = core.getInput('coverage-report-path');
    if (!coverageReportPath) {
      coverageReportPath = getCoverageReportPath(detectedType);
    }

    // Run checks based on project type
    const results = await runChecks(detectedType, coverageReportPath, coverageThreshold);

    // Post results to PR
    await postPRComment(token, results);
    await setCheckStatus(token, results);

    // Log results
    core.info(`Coverage: ${results.coverage.message}`);
    core.info(`Linting: ${results.lint.message}`);
    core.info(`Type Check: ${results.typeCheck.message}`);

    // Fail if any check failed
    const allPassed = results.coverage.passed && results.lint.passed && results.typeCheck.passed;
    if (!allPassed) {
      core.setFailed('Code quality gate checks failed');
    } else {
      core.info('✅ All quality gates passed!');
    }
  } catch (error) {
    core.setFailed(`Action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getCoverageReportPath(projectType: ProjectType): string {
  const paths: Record<ProjectType, string> = {
    nodejs: 'coverage/coverage-final.json',
    java: 'target/site/jacoco/jacoco.xml',
    springboot: 'target/site/jacoco/jacoco.xml',
  };
  return paths[projectType];
}

async function runChecks(
  projectType: ProjectType,
  coverageReportPath: string,
  coverageThreshold: number
) {
  if (projectType === 'java' || projectType === 'springboot') {
    const { checkJavaLinting } = await import('./java-checker');
    const [coverage, lint, typeCheck] = await Promise.all([
      checkCoverage(coverageReportPath, coverageThreshold),
      checkJavaLinting(),
      { passed: true, errors: 0, message: '✅ Java type checking (compile-time)' },
    ]);
    return { coverage, lint, typeCheck };
  } else {
    const [coverage, lint, typeCheck] = await Promise.all([
      checkCoverage(coverageReportPath, coverageThreshold),
      checkLinting(),
      checkTypes(),
    ]);
    return { coverage, lint, typeCheck };
  }
}

run();
