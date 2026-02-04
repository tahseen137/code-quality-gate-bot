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
const core = __importStar(require("@actions/core"));
const coverage_checker_1 = require("./coverage-checker");
const lint_checker_1 = require("./lint-checker");
const type_checker_1 = require("./type-checker");
const pr_commenter_1 = require("./pr-commenter");
const project_detector_1 = require("./project-detector");
async function run() {
    try {
        const token = core.getInput('github-token');
        const coverageThreshold = parseInt(core.getInput('coverage-threshold') || '70', 10);
        const projectType = core.getInput('project-type') || 'auto';
        core.info('Starting code quality gate checks...');
        // Detect project type if auto
        let detectedType = 'nodejs';
        if (projectType === 'auto') {
            detectedType = (0, project_detector_1.detectProjectType)();
            core.info(`Detected project type: ${detectedType}`);
        }
        else {
            detectedType = projectType;
        }
        // Determine coverage report path based on project type
        let coverageReportPath = core.getInput('coverage-report-path');
        if (!coverageReportPath) {
            coverageReportPath = getCoverageReportPath(detectedType);
        }
        // Run checks based on project type
        const results = await runChecks(detectedType, coverageReportPath, coverageThreshold);
        // Post results to PR
        await (0, pr_commenter_1.postPRComment)(token, results);
        await (0, pr_commenter_1.setCheckStatus)(token, results);
        // Log results
        core.info(`Coverage: ${results.coverage.message}`);
        core.info(`Linting: ${results.lint.message}`);
        core.info(`Type Check: ${results.typeCheck.message}`);
        // Fail if any check failed
        const allPassed = results.coverage.passed && results.lint.passed && results.typeCheck.passed;
        if (!allPassed) {
            core.setFailed('Code quality gate checks failed');
        }
        else {
            core.info('✅ All quality gates passed!');
        }
    }
    catch (error) {
        core.setFailed(`Action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
function getCoverageReportPath(projectType) {
    const paths = {
        nodejs: 'coverage/coverage-final.json',
        java: 'target/site/jacoco/jacoco.xml',
        springboot: 'target/site/jacoco/jacoco.xml',
    };
    return paths[projectType];
}
async function runChecks(projectType, coverageReportPath, coverageThreshold) {
    if (projectType === 'java' || projectType === 'springboot') {
        const { checkJavaLinting } = await Promise.resolve().then(() => __importStar(require('./java-checker')));
        const [coverage, lint, typeCheck] = await Promise.all([
            (0, coverage_checker_1.checkCoverage)(coverageReportPath, coverageThreshold),
            checkJavaLinting(),
            { passed: true, errors: 0, message: '✅ Java type checking (compile-time)' },
        ]);
        return { coverage, lint, typeCheck };
    }
    else {
        const [coverage, lint, typeCheck] = await Promise.all([
            (0, coverage_checker_1.checkCoverage)(coverageReportPath, coverageThreshold),
            (0, lint_checker_1.checkLinting)(),
            (0, type_checker_1.checkTypes)(),
        ]);
        return { coverage, lint, typeCheck };
    }
}
run();
//# sourceMappingURL=index.js.map