import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { ValidationResult } from '../validations/common/html5Rules';

export interface RouteValidationResult {
    url: string;
    status: 'success' | 'failed' | 'error';
    timestamp: string;
    errors: ValidationResult[];
    warnings: ValidationResult[];
    errorCount: number;
    warningCount: number;
    message?: string;
}

export interface ValidationReport {
    generatedAt: string;
    totalRoutes: number;
    passedRoutes: number;
    failedRoutes: number;
    totalErrors: number;
    totalWarnings: number;
    results: RouteValidationResult[];
}

/**
 * Handles all output operations including console logging and JSON report generation
 */
class output {
    private outputPath: string | null = null;
    private validationReport: ValidationReport;

    constructor(outputPath?: string) {
        this.validationReport = {
            generatedAt: new Date().toISOString(),
            totalRoutes: 0,
            passedRoutes: 0,
            failedRoutes: 0,
            totalErrors: 0,
            totalWarnings: 0,
            results: []
        };

        if (outputPath) {
            this.outputPath = outputPath;
        }
    }

    /**
     * Sets the total number of routes
     */
    setTotalRoutes(count: number): void {
        this.validationReport.totalRoutes = count;
    }

    /**
     * Logs validation start for a route
     */
    logValidationStart(index: number, total: number, url: string): void {
        console.log(`\n[${index + 1}/${total}] Validating: ${url}`);
        console.log('='.repeat(80));
    }

    /**
     * Logs HTML fetch success
     */
    logHtmlFetched(length: number): void {
        console.log(`HTML fetched (${length} characters)`);
    }

    /**
     * Logs validation completion
     */
    logValidationCompleted(): void {
        console.log('HTML5 validation completed successfully');
    }

    /**
     * Logs validation results
     */
    logValidationResults(results: string): void {
        console.log(results);
    }

    /**
     * Logs validation success
     */
    logValidationPassed(): void {
        console.log('✅ Validation PASSED - No errors found');
        this.validationReport.passedRoutes++;
    }

    /**
     * Logs validation failure
     */
    logValidationFailed(errorCount: number): void {
        console.log(`❌ Validation FAILED - ${errorCount} error(s) found`);
        this.validationReport.failedRoutes++;
    }

    /**
     * Logs error for a route
     */
    logRouteError(url: string, errorMessage: string): void {
        console.error(`\n❌ Error (${url}):`, errorMessage);
        console.log('='.repeat(80));
        this.validationReport.failedRoutes++;
    }

    /**
     * Logs completion message
     */
    logCompletion(): void {
        console.log('\n' + '='.repeat(80));
        console.log('Validation completed for all routes!');
    }

    /**
     * Logs critical error
     */
    logCriticalError(error: unknown): void {
        console.error("Critical Error:", error instanceof Error ? error.message : String(error));
    }

    /**
     * Adds a successful validation result to the report
     */
    addSuccessResult(
        url: string,
        errors: ValidationResult[],
        warnings: ValidationResult[]
    ): void {
        this.validationReport.results.push({
            url,
            status: 'success',
            timestamp: new Date().toISOString(),
            errors,
            warnings,
            errorCount: errors.length,
            warningCount: warnings.length
        });

        this.validationReport.totalErrors += errors.length;
        this.validationReport.totalWarnings += warnings.length;
    }

    /**
     * Adds a failed validation result to the report
     */
    addFailedResult(
        url: string,
        errors: ValidationResult[],
        warnings: ValidationResult[]
    ): void {
        this.validationReport.results.push({
            url,
            status: 'failed',
            timestamp: new Date().toISOString(),
            errors,
            warnings,
            errorCount: errors.length,
            warningCount: warnings.length
        });

        this.validationReport.totalErrors += errors.length;
        this.validationReport.totalWarnings += warnings.length;
    }

    /**
     * Adds an error result to the report
     */
    addErrorResult(url: string, errorMessage: string): void {
        this.validationReport.results.push({
            url,
            status: 'error',
            timestamp: new Date().toISOString(),
            errors: [],
            warnings: [],
            errorCount: 0,
            warningCount: 0,
            message: errorMessage
        });
    }

    /**
     * Saves validation report as JSON file
     */
    async saveJsonReport(): Promise<void> {
        if (!this.outputPath) {
            return;
        }

        try {
            const outputFile = this.outputPath.endsWith('.json')
                ? this.outputPath
                : `${this.outputPath}.json`;

            const fullPath = join(process.cwd(), outputFile);
            const jsonContent = JSON.stringify(this.validationReport, null, 2);

            await writeFile(fullPath, jsonContent, 'utf-8');

            this.logJsonReportSaved(fullPath);
            this.logSummary();
        } catch (error) {
            console.error('❌ Failed to save JSON report:', error instanceof Error ? error.message : String(error));
        }
    }

    /**
     * Logs JSON report saved message
     */
    private logJsonReportSaved(fullPath: string): void {
        console.log('\n' + '='.repeat(80));
        console.log(`📄 JSON report saved: ${fullPath}`);
        console.log('='.repeat(80));
    }

    /**
     * Logs validation summary
     */
    private logSummary(): void {
        console.log('\n📊 Summary:');
        console.log(`   Total Routes: ${this.validationReport.totalRoutes}`);
        console.log(`   ✅ Passed: ${this.validationReport.passedRoutes}`);
        console.log(`   ❌ Failed: ${this.validationReport.failedRoutes}`);
        console.log(`   🔴 Total Errors: ${this.validationReport.totalErrors}`);
        console.log(`   ⚠️  Total Warnings: ${this.validationReport.totalWarnings}`);
        console.log('='.repeat(80));
    }

    /**
     * Gets the validation report
     */
    getReport(): ValidationReport {
        return this.validationReport;
    }
}

export default output;