import { METADATA_ELEMENTS } from "../common/html5Rules";
import { ValidationResult } from "../common/validationResult";

export class MetaDataElementsValidation extends ValidationResult {
    private metadataElements: Set<string>;

    constructor() {
        super();
        this.metadataElements = METADATA_ELEMENTS;
    }

    validate(element: Element): void {
        if (this.metadataElements.has(element.tagName.toLowerCase())) {
            this.addResult({
                type: 'warning',
                message: `<${element.tagName}> element is a metadata element (metadata elements should not be used).`,
                extract: element.outerHTML.substring(0, 200),
                rule: 'meta-data-element'
            });
        }
    }
}