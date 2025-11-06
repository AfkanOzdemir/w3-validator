import { writeFile } from 'fs/promises';
import { join } from 'path';

class templateCreator {
    private templatePath: string;
    private templateContent: { routeList: string[] };

    constructor(templateName: string = 'routelist.json') {
        this.templatePath = join(process.cwd(), templateName);
        this.templateContent = {
            routeList: [
                "http://example.com",
                "http://example.com/about",
                "http://example.com/contact"
            ]
        };
    }

    async create(): Promise<void> {
        try {
            const jsonContent = JSON.stringify(this.templateContent, null, 2);
            await writeFile(this.templatePath, jsonContent, 'utf-8');
            console.log(`✅ Template file created successfully: ${this.templatePath}`);
        } catch (error) {
            console.error('❌ Error creating template file:', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    getTemplate(): { routeList: string[] } {
        return this.templateContent;
    }
}

export default templateCreator;