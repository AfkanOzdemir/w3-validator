import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Reads and parses route list from a JSON file
 */
class readRouteList {
    private routeListPath: string;
    private filePath: string;

    /**
     * Creates a new readRouteList instance
     * @param {string} routeListPath - Path to the route list JSON file
     */
    constructor(routeListPath: string) {
        this.routeListPath = routeListPath;
        this.filePath = '';
        if (!this.routeListPath) {
            console.error('Error: routeList.json file path not specified.');
            console.error('Usage: w3 <routeList.json file path>');
            process.exit(1);
        }

    }

    /**
     * Reads and parses the route list file
     * @returns {Promise<string[]>} Array of URLs to validate
     * @throws {Error} If file cannot be read or parsed
     */
    async read(): Promise<string[]> {
        this.filePath = this.routeListPath.startsWith('/') ? this.routeListPath : join(process.cwd(), this.routeListPath);
        console.log(`Reading route list from: ${this.filePath}\n`);

        const fileContent = await readFile(this.filePath, 'utf-8');
        const parsedContent = JSON.parse(fileContent);
        const routeData: string[] = parsedContent.routeList || (Array.isArray(parsedContent) ? parsedContent : []);

        if (!routeData || !Array.isArray(routeData) || routeData.length === 0) {
            console.error('Error: routeList.json file does not contain a valid route list.');
            process.exit(1);
        }

        console.log(`Total ${routeData.length} routes found.\n`);
        console.log('='.repeat(80));


        return routeData;
    }
}

export default readRouteList;