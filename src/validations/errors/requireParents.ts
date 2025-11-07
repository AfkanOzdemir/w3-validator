import { ValidationResult } from '../common/validationResult';
import { PARENT_REQUIREMENTS } from '../common/html5Rules';

export class RequireParentsValidation extends ValidationResult {
    validate(element: Element, tagName: string): void {
        const requiredParents = PARENT_REQUIREMENTS[tagName];

        if (!requiredParents) return;

        const parent = element.parentElement;
        if (!parent) return;

        const parentTag = parent.tagName.toLowerCase();

        if (!requiredParents.includes(parentTag)) {
            this.addResult({
                type: 'error',
                message: `<${tagName}> element must be inside <${requiredParents.join('>, <')}> elements. Currently inside <${parentTag}> element.`,
                extract: element.outerHTML.substring(0, 200),
                rule: 'invalid-parent'
            });
        }
    }
}