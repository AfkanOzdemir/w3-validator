/**
 * HTML5 Validation Rules
 */

export interface ValidationResult {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
  extract?: string;
  rule: string;
}

/**
 * HTML5 void elements (self-closing)
 */
export const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/**
 * Deprecated HTML elements
 */
export const DEPRECATED_ELEMENTS = new Set([
  'acronym', 'applet', 'basefont', 'big', 'center', 'dir',
  'font', 'frame', 'frameset', 'noframes', 'strike', 'tt'
]);

/**
 * Required attributes for specific elements
 */
export const REQUIRED_ATTRIBUTES: Record<string, string[]> = {
  'img': ['alt', 'src'],
  'a': ['href'], // href is required (anchor)
  'link': ['rel'],
  'meta': ['charset', 'name', 'content', 'http-equiv', 'content'], // charset or name+content or http-equiv+content
  'source': ['src'],
  'input': ['type'],
  'textarea': ['value'],
  'label': ['for'],
  'optgroup': ['label'],
  'option': ['value'],
  'form': ['action', 'method'],
  'iframe': ['src'],
  'area': ['alt'],
  'script': ['src', 'type'],
};

/**
 * Elements that require specific parent elements
 */
export const PARENT_REQUIREMENTS: Record<string, string[]> = {
  'li': ['ul', 'ol', 'menu'],
  'dt': ['dl'],
  'dd': ['dl'],
  'tr': ['table', 'thead', 'tbody', 'tfoot'],
  'th': ['tr'],
  'td': ['tr'],
  'thead': ['table'],
  'tbody': ['table'],
  'tfoot': ['table'],
  'col': ['colgroup'],
  'colgroup': ['table'],
  'caption': ['table'],
  'legend': ['fieldset'],
  'option': ['select', 'datalist', 'optgroup'],
  'optgroup': ['select']
};

/**
 * Elements that cannot contain specific children
 */
export const FORBIDDEN_CHILDREN: Record<string, string[]> = {
  'p': ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'table', 'ul', 'ol'],
  'button': ['button', 'a', 'input', 'select', 'textarea'],
  'a': ['a'],
  'form': ['form'],
  'label': ['label']
};

/**
 * Metadata content elements (can be in head)
 */
export const METADATA_ELEMENTS = new Set([
  'base', 'link', 'meta', 'noscript', 'script', 'style', 'title'
]);

/**
 * Interactive elements
 */
export const INTERACTIVE_ELEMENTS = new Set([
  'a', 'audio', 'button', 'details', 'embed', 'iframe', 'img',
  'input', 'label', 'select', 'textarea', 'video'
]);

/**
 * Block-level elements
 */
export const BLOCK_ELEMENTS = new Set([
  'address', 'article', 'aside', 'blockquote', 'details', 'dialog', 'dd', 'div',
  'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2',
  'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav', 'ol',
  'p', 'pre', 'section', 'table', 'ul'
]);

/**
 * Inline elements
 */
export const INLINE_ELEMENTS = new Set([
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em',
  'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]);

/**
 * Valid HTML5 element tags
 */
export const VALID_HTML5_ELEMENTS = new Set([
  // Document structure
  'html',

  // Document metadata
  'base', 'head', 'link', 'meta', 'style', 'title',

  // Sectioning root
  'body',

  // Content sectioning
  'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'main', 'nav', 'section',

  // Text content
  'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'menu', 'ol',
  'p', 'pre', 'ul',

  // Inline text semantics
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd',
  'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup',
  'time', 'u', 'var', 'wbr',

  // Image and multimedia
  'area', 'audio', 'img', 'map', 'track', 'video',

  // Embedded content
  'embed', 'iframe', 'object', 'picture', 'portal', 'source',

  // SVG and MathML
  'svg', 'math',

  // Scripting
  'canvas', 'noscript', 'script',

  // Demarcating edits
  'del', 'ins',

  // Table content
  'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',

  // Forms
  'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend', 'meter', 'optgroup',
  'option', 'output', 'progress', 'select', 'textarea',

  // Interactive elements
  'details', 'dialog', 'summary',

  // Web Components
  'slot', 'template'
]);

/**
 * Global attributes (can be used on any element)
 */
export const GLOBAL_ATTRIBUTES = new Set([
  'accesskey', 'class', 'contenteditable', 'data-*', 'dir', 'draggable',
  'hidden', 'id', 'lang', 'spellcheck', 'style', 'tabindex', 'title',
  'translate', 'role', 'aria-*'
]);

/**
 * Boolean attributes (presence = true)
 */
export const BOOLEAN_ATTRIBUTES = new Set([
  'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default',
  'defer', 'disabled', 'formnovalidate', 'hidden', 'ismap', 'loop',
  'multiple', 'muted', 'novalidate', 'open', 'readonly', 'required',
  'reversed', 'selected'
]);

/**
 * Elements that must have closing tags
 */
export const MUST_CLOSE_ELEMENTS = new Set([
  'script', 'style', 'title', 'textarea', 'pre'
]);

