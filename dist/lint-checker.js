"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLinting = checkLinting;
const child_process_1 = require("child_process");
async function checkLinting(workingDirectory = '.') {
    try {
        (0, child_process_1.execSync)('eslint . --format json --max-warnings 0', {
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
    }
    catch (error) {
        if (error instanceof Error && 'stdout' in error) {
            try {
                const results = JSON.parse(error.stdout || '[]');
                const totalErrors = results.reduce((sum, file) => sum + (file.errorCount || 0), 0);
                const totalWarnings = results.reduce((sum, file) => sum + (file.warningCount || 0), 0);
                return {
                    passed: totalErrors === 0,
                    errors: totalErrors,
                    warnings: totalWarnings,
                    message: totalErrors > 0
                        ? `❌ Linting failed: ${totalErrors} error(s), ${totalWarnings} warning(s)`
                        : `⚠️ Linting warnings: ${totalWarnings}`,
                };
            }
            catch {
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
//# sourceMappingURL=lint-checker.js.map