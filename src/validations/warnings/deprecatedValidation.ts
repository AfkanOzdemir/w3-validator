import { ValidationResult } from '../common/validationResult';
import { DEPRECATED_ELEMENTS } from '../common/html5Rules';

export class DeprecatedValidation extends ValidationResult {
    private deprecatedElements: Set<string>;

    constructor() {
        super();
        this.deprecatedElements = DEPRECATED_ELEMENTS;
    }

    validate(element: Element): void {
        if (this.deprecatedElements.has(element.tagName.toLowerCase())) {
            this.addResult({
                type: 'warning',
                message: `"<${element.tagName}> element is deprecated (deprecated elements should not be used). Modern alternatives should be used.`,
                extract: element.outerHTML.substring(0, 200),
                rule: 'deprecated-element'
            });
        }
    }
}
