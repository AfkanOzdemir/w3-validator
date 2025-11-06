import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Creates a template route list JSON file
 */
class templateCreator {
    private templatePath: string;
    private templateContent: { routeList: string[] };

    /**
     * Creates a new templateCreator instance
     * @param {string} templateName - Name of the template file (default: 'routelist.json')
     */
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

    /**
     * Creates the template file with example routes
     * @returns {Promise<void>}
     * @throws {Error} If file creation fails
     */
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

    /**
     * Returns the template content
     * @returns {{ routeList: string[] }} The template object
     */
    getTemplate(): { routeList: string[] } {
        return this.templateContent;
    }
}

export default templateCreator;