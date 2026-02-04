export interface CoverageResult {
    passed: boolean;
    coverage: number;
    threshold: number;
    message: string;
}
export declare function checkCoverage(coverageReportPath: string, threshold?: number): Promise<CoverageResult>;
//# sourceMappingURL=coverage-checker.d.ts.map