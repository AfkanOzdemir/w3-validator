import { ValidationResult } from '../common/validationResult';
import { FORBIDDEN_CHILDREN } from '../common/html5Rules';

export class ForbiddenChildrenValidation extends ValidationResult {
    validate(element: Element, tagName: string): void {
        const forbiddenChildren = FORBIDDEN_CHILDREN[tagName];

        if (!forbiddenChildren) return;

        const children = Array.from(element.children);

        children.forEach((child) => {
            const childTag = child.tagName.toLowerCase();

            if (forbiddenChildren.includes(childTag)) {
                this.addResult({
                    type: 'error',
                    message: `<${tagName}> element cannot contain <${forbiddenChildren.join('>, <')}> elements. Currently contains <${childTag}> element.`,
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'forbidden-children'
                });
            }
        });
    }
}