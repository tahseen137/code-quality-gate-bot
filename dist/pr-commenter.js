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
exports.postPRComment = postPRComment;
exports.setCheckStatus = setCheckStatus;
const github = __importStar(require("@actions/github"));
async function postPRComment(token, results) {
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
function buildComment(results, allPassed) {
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
async function setCheckStatus(token, results) {
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
//# sourceMappingURL=pr-commenter.js.map