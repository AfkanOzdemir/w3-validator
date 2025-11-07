import { ValidationResult } from '../common/validationResult';
import { VOID_ELEMENTS } from '../common/html5Rules';

export class VoidElementsValidation extends ValidationResult {
    private voidElements: Set<string>;

    constructor() {
        super();
        this.voidElements = VOID_ELEMENTS;
    }

    validate(element: Element): void {
        if (this.voidElements.has(element.tagName.toLowerCase())) {
            if (element.childNodes.length > 0) {
                this.addResult({
                    type: 'error',
                    message: `<${element.tagName}> is a void element and cannot have content.`,
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'void-element-content'
                });
            }
        }
    }
}
