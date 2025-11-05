class validateHtml {

    private rawHtml: string;
    private retries: number;

    constructor(rawHtml: string, retries: number = 3) {
        this.rawHtml = rawHtml;
        this.retries = retries;
        this.init();
    }

    async init() {
        for (let i = 0; i < this.retries; i++) {
            try {
                console.log(`Validation attempt ${i + 1} started...`);
                const response = await fetch("https://validator.w3.org/nu/", {
                    method: "POST",
                    body: this.rawHtml,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Content-Type": "text/html",
                    },
                });

                return response.text();
            } catch (error) {
                throw new Error(`Validation attempt ${i + 1} failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        throw new Error("Validation failed: Maximum number of retries reached");
    }
}

export default validateHtml;