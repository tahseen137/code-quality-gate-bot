export interface TypeCheckResult {
    passed: boolean;
    errors: number;
    message: string;
}
export declare function checkTypes(workingDirectory?: string): Promise<TypeCheckResult>;
//# sourceMappingURL=type-checker.d.ts.map