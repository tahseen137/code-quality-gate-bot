import { CoverageResult } from './coverage-checker';
import { LintResult } from './lint-checker';
import { TypeCheckResult } from './type-checker';
export interface QualityCheckResults {
    coverage: CoverageResult;
    lint: LintResult;
    typeCheck: TypeCheckResult;
}
export declare function postPRComment(token: string, results: QualityCheckResults): Promise<void>;
export declare function setCheckStatus(token: string, results: QualityCheckResults): Promise<void>;
//# sourceMappingURL=pr-commenter.d.ts.map