class getRawHtml {

    constructor(url: string) {
        this.init(url);
    }

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