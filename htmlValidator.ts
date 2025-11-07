import { JSDOM } from 'jsdom';
import type { ValidationResult } from './src/validations/common/html5Rules';
import {
    VOID_ELEMENTS,
    DEPRECATED_ELEMENTS,
    REQUIRED_ATTRIBUTES,
    PARENT_REQUIREMENTS,
    FORBIDDEN_CHILDREN,
    VALID_HTML5_ELEMENTS
} from './src/validations/common/html5Rules';

/**
 * HTML5 Validator Engine
 * W3C HTML5 standards
 */
export class HtmlValidator {
    private html: string;
    private errors: ValidationResult[] = [];
    private warnings: ValidationResult[] = [];
    private dom: JSDOM | null = null;

    constructor(html: string) {
        this.html = html;
    }

    /**
     * Start HTML validation
     */
    async validate(): Promise<{ errors: ValidationResult[]; warnings: ValidationResult[] }> {
        this.errors = [];
        this.warnings = [];

        try {
            // 1. DOCTYPE validation
            this.validateDoctype();

            // 2. Unclosed tags validation (before JSDOM parses)
            this.validateUnclosedTags();

            // 3. HTML structure parse
            this.dom = new JSDOM(this.html);
            const document = this.dom.window.document;

            // 4. Root element validation (html)
            this.validateRootElement(document);

            // 5. Head validation
            this.validateHead(document);

            // 6. Body validation
            this.validateBody(document);

            // 7. Validate all elements
            this.validateAllElements(document);

            // 8. Character encoding validation
            this.validateCharset(document);

        } catch (error) {
            this.errors.push({
                type: 'error',
                message: `Parse error: ${error instanceof Error ? error.message : String(error)}`,
                rule: 'parse-error'
            });
        }

        return {
            errors: this.errors,
            warnings: this.warnings
        };
    }

    /**
     * DOCTYPE validation
     */
    private validateDoctype(): void {
        const doctypeRegex = /<!DOCTYPE\s+html>/i;

        if (!doctypeRegex.test(this.html)) {
            this.errors.push({
                type: 'error',
                message: 'DOCTYPE declaration is missing or invalid. Use "<!DOCTYPE html>" for HTML5.',
                line: 1,
                rule: 'doctype-required'
            });
        }

        // Check if DOCTYPE is at the beginning of the document
        const firstNonWhitespace = this.html.trim();
        if (!firstNonWhitespace.toLowerCase().startsWith('<!doctype html>')) {
            this.warnings.push({
                type: 'warning',
                message: 'DOCTYPE declaration must be at the beginning of the document.',
                rule: 'doctype-position'
            });
        }
    }

    /**
     * Validate unclosed tags
     */
    private validateUnclosedTags(): void {
        // Temporarily remove HTML comments (preserve line breaks), script and style contents
        let cleanHtml = this.html
            .replace(/<!--[\s\S]*?-->/g, (match) => '\n'.repeat((match.match(/\n/g) || []).length)) // Replace comments with newlines to preserve line numbers
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (match) => {
                // Keep opening and closing script tags but replace content with newlines
                const openTag = match.match(/<script\b[^>]*>/i)?.[0] || '';
                const closeTag = '</script>';
                const content = match.substring(openTag.length, match.length - closeTag.length);
                const newlines = '\n'.repeat((content.match(/\n/g) || []).length);
                return openTag + newlines + closeTag;
            })
            .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (match) => {
                // Keep opening and closing style tags but replace content with newlines
                const openTag = match.match(/<style\b[^>]*>/i)?.[0] || '';
                const closeTag = '</style>';
                const content = match.substring(openTag.length, match.length - closeTag.length);
                const newlines = '\n'.repeat((content.match(/\n/g) || []).length);
                return openTag + newlines + closeTag;
            });

        // Find all tags
        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g;
        const stack: Array<{ tag: string; position: number }> = [];
        let match;

        while ((match = tagRegex.exec(cleanHtml)) !== null) {
            const fullTag = match[0];
            const tagName = match[1].toLowerCase();
            const position = match.index;

            // Calculate line number
            const lineNumber = (cleanHtml.substring(0, position).match(/\n/g) || []).length + 1;

            // Check if it's a self-closing tag
            const isSelfClosing = fullTag.endsWith('/>') || VOID_ELEMENTS.has(tagName);

            // Skip DOCTYPE, self-closing or void elements
            if (tagName === '!doctype' || isSelfClosing) {
                continue;
            }

            // Is it a closing tag?
            if (fullTag.startsWith('</')) {
                // Find matching opening tag from stack
                if (stack.length === 0) {
                    this.errors.push({
                        type: 'error',
                        message: `"</${tagName}>" kapanış etiketi bulundu ancak açılış etiketi yok.`,
                        line: lineNumber,
                        extract: fullTag,
                        rule: 'unmatched-closing-tag'
                    });
                    continue;
                }

                const lastOpened = stack[stack.length - 1];

                if (lastOpened.tag === tagName) {
                    // Correct match
                    stack.pop();
                } else {
                    // Wrong match - unclosed tag exists
                    const lastOpenedLineNumber = (cleanHtml.substring(0, lastOpened.position).match(/\n/g) || []).length + 1;

                    this.errors.push({
                        type: 'error',
                        message: `"<${lastOpened.tag}>" etiketi (satır ${lastOpenedLineNumber}) açık bırakılmış. "</${tagName}>" ile kapatılmaya çalışılıyor.`,
                        line: lineNumber,
                        extract: fullTag,
                        rule: 'unclosed-tag'
                    });

                    // Clean stack - fix wrong match
                    stack.pop();
                }
            } else {
                // Opening tag - add to stack
                stack.push({ tag: tagName, position });
            }
        }

        // Check if there are unclosed tags remaining in stack
        if (stack.length > 0) {
            stack.forEach((item) => {
                const lineNum = (cleanHtml.substring(0, item.position).match(/\n/g) || []).length + 1;
                this.errors.push({
                    type: 'error',
                    message: `"<${item.tag}>" etiketi (satır ${lineNum}) açık bırakılmış. Kapanış etiketi "</${item.tag}>" bulunamadı.`,
                    line: lineNum,
                    rule: 'unclosed-tag'
                });
            });
        }
    }

    /**
     * Root <html> element validation
     */
    private validateRootElement(document: Document): void {
        const htmlElement = document.documentElement;

        if (!htmlElement || htmlElement.tagName.toLowerCase() !== 'html') {
            this.errors.push({
                type: 'error',
                message: 'Root element <html> is required.',
                rule: 'root-element'
            });
            return;
        }

        // lang attribute validation (recommended)
        if (!htmlElement.hasAttribute('lang')) {
            this.warnings.push({
                type: 'warning',
                message: '<html> element must have "lang" attribute (e.g. lang="tr").',
                rule: 'html-lang'
            });
        }
    }

    /**
     * Head section validation
     */
    private validateHead(document: Document): void {
        const head = document.querySelector('head');

        if (!head) {
            this.errors.push({
                type: 'error',
                message: '<head> element is missing.',
                rule: 'head-required'
            });
            return;
        }

        // Title validation
        const title = head.querySelector('title');
        if (!title) {
            this.errors.push({
                type: 'error',
                message: '<head> must contain <title> element.',
                rule: 'title-required'
            });
        } else if (!title.textContent?.trim()) {
            this.errors.push({
                type: 'error',
                message: '<title> element cannot be empty.',
                rule: 'title-empty'
            });
        }

        // Meta charset validation
        const charset = head.querySelector('meta[charset]');
        if (!charset) {
            this.warnings.push({
                type: 'warning',
                message: '<head> must contain character encoding (e.g. <meta charset="UTF-8">).',
                rule: 'charset-recommended'
            });
        }
    }

    /**
     * Body section validation
     */
    private validateBody(document: Document): void {
        const body = document.querySelector('body');

        if (!body) {
            this.errors.push({
                type: 'error',
                message: '<body> element is missing.',
                rule: 'body-required'
            });
        }
    }

    /**
     * Validate all elements
     */
    private validateAllElements(document: Document): void {
        const allElements = document.querySelectorAll('*');

        allElements.forEach((element) => {
            const tagName = element.tagName.toLowerCase();

            // 1. Is valid HTML5 element?
            this.validateElementName(element, tagName);

            // 2. Deprecated element validation
            this.validateDeprecatedElements(element, tagName);

            // 3. Required attributes validation
            this.validateRequiredAttributes(element, tagName);

            // 4. Parent-child relationship validation
            this.validateParentChildRelationship(element, tagName);

            // 5. Forbidden children validation
            this.validateForbiddenChildren(element, tagName);

            // 6. Void element validation
            this.validateVoidElements(element, tagName);

            // 7. Attributes validation
            this.validateAttributes(element);
        });
    }

    /**
     * Validate element name
     */
    private validateElementName(element: Element, tagName: string): void {
        // Custom elements (contains hyphen) are valid
        if (tagName.includes('-')) {
            return;
        }

        if (!VALID_HTML5_ELEMENTS.has(tagName)) {
            this.errors.push({
                type: 'error',
                message: `"<${tagName}> is not a valid HTML5 element.`,
                extract: element.outerHTML.substring(0, 200),
                rule: 'invalid-element'
            });
        }
    }

    /**
     * Validate deprecated elements
     */
    private validateDeprecatedElements(element: Element, tagName: string): void {
        if (DEPRECATED_ELEMENTS.has(tagName)) {
            this.warnings.push({
                type: 'warning',
                message: `"<${tagName}> element is deprecated (deprecated elements should not be used). Modern alternatives should be used.`,
                extract: element.outerHTML.substring(0, 200),
                rule: 'deprecated-element'
            });
        }
    }

    /**
     * Validate required attributes
     */
    private validateRequiredAttributes(element: Element, tagName: string): void {
        const requiredAttrs = REQUIRED_ATTRIBUTES[tagName];

        if (!requiredAttrs) return;

        // img element validation
        if (tagName === 'img') {
            if (!element.hasAttribute('src')) {
                this.errors.push({
                    type: 'error',
                    message: '<img> element must have "src" attribute.',
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'img-src-required'
                });
            }

            if (!element.hasAttribute('alt')) {
                this.errors.push({
                    type: 'error',
                    message: '<img> element must have "alt" attribute (accessibility).',
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'img-alt-required'
                });
            }
        }

        // area element validation
        if (tagName === 'area' && !element.hasAttribute('alt')) {
            this.errors.push({
                type: 'error',
                message: '<area> element must have "alt" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'area-alt-required'
            });
        }

        // input type validation
        if (tagName === 'input' && !element.hasAttribute('type')) {
            this.warnings.push({
                type: 'warning',
                message: '<input> element must have "type" attribute.',
                extract: element.outerHTML.substring(0, 200),
                rule: 'input-type-recommended'
            });
        }
    }

    /**
     * Parent-child relationship validation
     */
    private validateParentChildRelationship(element: Element, tagName: string): void {
        const requiredParents = PARENT_REQUIREMENTS[tagName];

        if (!requiredParents) return;

        const parent = element.parentElement;
        if (!parent) return;

        const parentTag = parent.tagName.toLowerCase();

        if (!requiredParents.includes(parentTag)) {
            this.errors.push({
                type: 'error',
                message: `<${tagName}> element must be inside <${requiredParents.join('>, <')}> elements. Currently inside <${parentTag}> element.`,
                extract: element.outerHTML.substring(0, 200),
                rule: 'invalid-parent'
            });
        }
    }

    /**
     * Forbidden children validation
     */
    private validateForbiddenChildren(element: Element, tagName: string): void {
        const forbiddenChildren = FORBIDDEN_CHILDREN[tagName];

        if (!forbiddenChildren) return;

        const children = Array.from(element.children);

        children.forEach((child) => {
            const childTag = child.tagName.toLowerCase();

            if (forbiddenChildren.includes(childTag)) {
                this.errors.push({
                    type: 'error',
                    message: `<${tagName}> element cannot contain <${childTag}> element.`,
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'forbidden-child'
                });
            }
        });
    }

    /**
     * Void elements validation (self-closing elements)
     */
    private validateVoidElements(element: Element, tagName: string): void {
        if (VOID_ELEMENTS.has(tagName)) {
            // Void elements cannot have content
            if (element.childNodes.length > 0) {
                this.errors.push({
                    type: 'error',
                    message: `<${tagName}> is a void element and cannot have content.`,
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'void-element-content'
                });
            }
        }
    }

    /**
     * Attributes validation
     */
    private validateAttributes(element: Element): void {
        const attributes = Array.from(element.attributes);

        attributes.forEach((attr) => {
            const attrName = attr.name.toLowerCase();

            // ID uniqueness validation
            if (attrName === 'id') {
                this.validateUniqueId(element, attr.value);
            }

            // Empty attribute value validation (for non-boolean attributes)
            if (!attr.value && attrName !== 'alt') {
                this.warnings.push({
                    type: 'warning',
                    message: `"${attrName}" attribute has an empty value.`,
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'empty-attribute'
                });
            }

            // onclick inline event handlers (not recommended)
            if (attrName.startsWith('on')) {
                this.warnings.push({
                    type: 'warning',
                    message: `Inline event handler "${attrName}" is not recommended. Use addEventListener in JavaScript file.`,
                    extract: element.outerHTML.substring(0, 200),
                    rule: 'inline-event-handler'
                });
            }
        });
    }

    /**
     * ID uniqueness validation
     */
    private validateUniqueId(element: Element, id: string): void {
        if (!this.dom) return;

        const elementsWithSameId = this.dom.window.document.querySelectorAll(`[id="${id}"]`);

        if (elementsWithSameId.length > 1) {
            this.errors.push({
                type: 'error',
                message: `ID "${id}" is used in multiple elements. IDs must be unique.`,
                extract: element.outerHTML.substring(0, 200),
                rule: 'duplicate-id'
            });
        }
    }

    /**
     * Character encoding validation
     */
    private validateCharset(document: Document): void {
        const metaCharset = document.querySelector('meta[charset]');
        const metaHttpEquiv = document.querySelector('meta[http-equiv="Content-Type"]');

        if (!metaCharset && !metaHttpEquiv) {
            this.warnings.push({
                type: 'warning',
                message: 'Character encoding (charset) is not specified.',
                rule: 'charset-missing'
            });
        }
    }

    /**
     * Get validation results
     */
    getResults(): { errors: ValidationResult[]; warnings: ValidationResult[] } {
        return {
            errors: this.errors,
            warnings: this.warnings
        };
    }
}

export default HtmlValidator;

