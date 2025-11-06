import { JSDOM } from "jsdom";

/**
 * Parses W3C validation results from HTML response
 */
class validationParser {

    private html: string;
    private results: any[] = [];

    /**
     * Creates a new validationParser instance
     * @param {string} html - The W3C validator response HTML to parse
     */
    constructor(html: string) {
        this.html = html;
        this.results = [];
    }

    /**
     * Parses the validation HTML and extracts error/warning information
     * @returns {Promise<void>}
     * @throws {Error} If validation results cannot be found in HTML
     */
    async parse(): Promise<void> {
        const dom = new JSDOM(this.html);
        const document = dom.window.document;
        const resultsElement = document.getElementById("results");

        if (!resultsElement) {
            console.error("HTML içeriği (ilk 500 karakter):", this.html.substring(0, 500));
            throw new Error("Validation results not found");
        }

        const listItems = resultsElement.querySelectorAll("ol li");

        listItems.forEach((element) => {
            const classList = element.className || "";

            const type = element.querySelector("strong")?.textContent || "";
            const message = element.querySelector("p:first-of-type span")?.textContent?.trim() || "";

            const fromLine = element.querySelector(".first-line")?.textContent || "";
            const fromCol = element.querySelector(".first-col")?.textContent || "";
            const toLine = element.querySelector(".last-line")?.textContent || "";
            const toCol = element.querySelector(".last-col")?.textContent || "";

            const extract = element.querySelector(".extract code")?.textContent?.trim() || "";

            this.results.push({
                type,
                class: classList,
                message,
                location: {
                    from: { line: fromLine, column: fromCol },
                    to: { line: toLine, column: toCol },
                },
                extract,
            });
        });
    }

    /**
     * Formats and returns the parsed validation results as a string
     * @returns {string} Formatted validation results
     */
    result(): string {
        var output = "\n=== VALIDATION RESULTS ===\n\n";

        this.results.forEach((item: any, index: number) => {
            output += `[${index + 1}] ${item.type} (${item.class})\n`;
            output += `Message: ${item.message}\n`;
            output += `Location: Line ${item.location.from.line}:${item.location.from.column} to Line ${item.location.to.line}:${item.location.to.column}\n`;
            output += `Extract: ${item.extract}\n`;
            output += "---\n\n";
        });

        return output;
    }
}

export default validationParser;