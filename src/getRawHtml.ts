/**
 * Fetches raw HTML content from a given URL
 */
class getRawHtml {

    /**
     * Creates a new getRawHtml instance
     * @param {string} url - The URL to fetch HTML from
     */
    constructor(url: string) {
        this.init(url);
    }

    /**
     * Initializes and fetches HTML content from the specified URL
     * @param {string} url - The URL to fetch HTML from
     * @returns {Promise<string>} The raw HTML content
     * @throws {Error} If the fetch operation fails
     */
    async init(url: string): Promise<string> {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html",
            },
        }).then(response => response.text()).catch(error => {
            throw new Error(`Failed to fetch HTML from ${url}: ${error instanceof Error ? error.message : String(error)}`);
        });

        return response;
    }
}

export default getRawHtml;