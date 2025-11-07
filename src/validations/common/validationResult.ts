// validationResult.ts
export interface ValidationResultItem {
    type: 'error' | 'warning';
    message: string;
    extract?: string;
    rule?: string;
}

export class ValidationResult {
    protected results: ValidationResultItem[] = [];

    addResult(result: ValidationResultItem): void {
        this.results.push(result);
    }

    getResults(): ValidationResultItem[] {
        return this.results;
    }

    hasErrors(): boolean {
        return this.results.some(r => r.type === 'error');
    }

    hasWarnings(): boolean {
        return this.results.some(r => r.type === 'warning');
    }
}
