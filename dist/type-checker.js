"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTypes = checkTypes;
const child_process_1 = require("child_process");
async function checkTypes(workingDirectory = '.') {
    try {
        (0, child_process_1.execSync)('tsc --noEmit', {
            cwd: workingDirectory,
            encoding: 'utf-8',
            stdio: 'pipe',
        });
        return {
            passed: true,
            errors: 0,
            message: '✅ No TypeScript errors found',
        };
    }
    catch (error) {
        const output = error instanceof Error ? error.toString() : 'Unknown error';
        const errorCount = (output.match(/error TS\d+:/g) || []).length;
        return {
            passed: false,
            errors: errorCount || 1,
            message: `❌ TypeScript errors found: ${errorCount || 1} error(s)`,
        };
    }
}
//# sourceMappingURL=type-checker.js.map