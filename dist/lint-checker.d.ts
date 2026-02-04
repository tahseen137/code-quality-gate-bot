export interface LintResult {
    passed: boolean;
    errors: number;
    warnings: number;
    message: string;
}
export declare function checkLinting(workingDirectory?: string): Promise<LintResult>;
//# sourceMappingURL=lint-checker.d.ts.map