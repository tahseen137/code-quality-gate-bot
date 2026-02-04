export interface LintResult {
    passed: boolean;
    errors: number;
    warnings: number;
    message: string;
}
export declare function checkJavaLinting(): Promise<LintResult>;
export declare function checkJavaCompilation(): Promise<{
    passed: boolean;
    message: string;
}>;
//# sourceMappingURL=java-checker.d.ts.map