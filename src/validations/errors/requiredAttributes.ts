import { ValidationResult } from '../common/validationResult';
import { REQUIRED_ATTRIBUTES } from '../common/html5Rules';

export class RequiredAttributesValidation extends ValidationResult {
    validate(element: Element, tagName: string): void {
        const requiredAttrs = REQUIRED_ATTRIBUTES[tagName];

        if (!requiredAttrs) return;

        if (tagName === 'img') {
            if (!element.hasAttribute('src')) {
                this.addResult({
                    type: 'error',
                    message: '<img> element must have "src" attribute.',
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'img-src-required'
                });
            }

            if (!element.hasAttribute('alt')) {
                this.addResult({
                    type: 'error',
                    message: '<img> element must have "alt" attribute (accessibility).',
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'img-alt-required'
                });
            }
        }

        if (tagName === 'a' && !element.hasAttribute('href')) {
            this.addResult({
                type: 'error',
                message: '<a> element must have "href" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'a-href-required'
            });
        }

        if (tagName === 'link' && !element.hasAttribute('rel')) {
            this.addResult({
                type: 'error',
                message: '<link> element must have "rel" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'link-rel-required'
            });
        }

        if (tagName === 'meta' && !element.hasAttribute('charset') && !element.hasAttribute('name') && !element.hasAttribute('content') && !element.hasAttribute('http-equiv') && !element.hasAttribute('content')) {
            this.addResult({
                type: 'error',
                message: '<meta> element must have "charset" or "name" or "content" or "http-equiv" or "content" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'meta-charset-required'
            });
        }

        if (tagName === 'source' && !element.hasAttribute('src')) {
            this.addResult({
                type: 'error',
                message: '<source> element must have "src" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'source-src-required'
            });
        }

        if (tagName === 'input' && !element.hasAttribute('type')) {
            this.addResult({
                type: 'error',
                message: '<input> element must have "type" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'input-type-recommended'
            });
        }

        if (tagName === 'textarea' && !element.hasAttribute('value')) {
            this.addResult({
                type: 'error',
                message: '<textarea> element must have "value" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'textarea-value-required'
            });
        }

        if (tagName === 'label' && !element.hasAttribute('for')) {
            this.addResult({
                type: 'error',
                message: '<label> element must have "for" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'label-for-required'
            });
        }

        if (tagName === 'optgroup' && !element.hasAttribute('label')) {
            this.addResult({
                type: 'error',
                message: '<optgroup> element must have "label" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'optgroup-label-required'
            });
        }

        if (tagName === 'option' && !element.hasAttribute('value')) {
            this.addResult({
                type: 'error',
                message: '<option> element must have "value" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'option-value-required'
            });
        }

        if (tagName === 'form' && !element.hasAttribute('action') && !element.hasAttribute('method')) {
            this.addResult({
                type: 'error',
                message: '<form> element must have "action" and "method" attributes.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'form-action-method-required'
            });
        }

        if (tagName === 'iframe' && !element.hasAttribute('src')) {
            this.addResult({
                type: 'error',
                message: '<iframe> element must have "src" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'iframe-src-required'
            });
        }

        if (tagName === 'area' && !element.hasAttribute('alt')) {
            this.addResult({
                type: 'error',
                message: '<area> element must have "alt" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'area-alt-required'
            });
        }

        if (tagName === 'script' && !element.hasAttribute('src') && !element.hasAttribute('type')) {
            this.addResult({
                type: 'error',
                message: '<script> element must have "src" or "type" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'script-src-type-required'
            });
        }
    }
}