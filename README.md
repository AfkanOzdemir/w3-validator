# W3C HTML Validator for Node.js

Validate HTML code from your URLs using the W3C HTML validator. This package automatically checks your HTML pages using W3C's official validator.

## 🚀 Installation

### Global Installation (recommended for CLI usage)

```bash
npm install -g w3validator
```

Now you can use the `w3` command from anywhere!

### Local Installation (for programmatic usage)

```bash
npm install w3validator
```

**To uninstall:**
```bash
npm uninstall -g w3validator
```

## 📋 Features

- ✅ Uses official W3C validator
- 🔄 Automatic retry mechanism
- 📊 Detailed error reports
- 🎯 Multiple URL support

## ⚙️ Usage

### CLI Usage

1. First, create a `routeList.json` file:
```json
{
  "routeList": [
    "http://example.com",
    "http://example.com/about",
    "http://example.com/contact"
  ]
}
```

2. After global installation, run from any directory:
```bash
w3 /path/to/routeList.json
```

### Example Route List File
```json
{
  "routeList": [
    "http://127.0.0.1:8000/",
    "http://127.0.0.1:8000/category1",
    "http://127.0.0.1:8000/category2",
    "http://127.0.0.1:8000/author",
    "http://127.0.0.1:8000/search"
  ]
}
```

## 📊 Output Example
```
[1/5] Validating: http://127.0.0.1:8000/
================================================================================
HTML fetched (15234 characters)
Validation attempt 1 started...
W3 validation completed successfully

=== VALIDATION RESULTS ===

[1] Error (error)
Message: Element "div" not allowed as child of element "span"
Location: Line 45:12 to Line 45:16
Extract: <span><div class="content">
---

[2] Warning (warning)
Message: Consider using the "h1" element as a top-level heading
Location: Line 120:5 to Line 120:9
Extract: <h2>Welcome</h2>
---

================================================================================
Validation completed for all routes!
```

## 🛠️ Technologies

- TypeScript
- Node.js
- W3C HTML Validator
- JSDOM (HTML parsing)
- Vite (bundler)

## 🔗 Useful Links

- [W3C HTML Validator](https://validator.w3.org/)