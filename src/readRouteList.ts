import { readFile } from 'fs/promises';
import { join } from 'path';

class readRouteList {
    private routeListPath: string;
    private filePath: string;

    constructor(routeListPath: string) {
        this.routeListPath = routeListPath;
        this.filePath = '';
        if (!this.routeListPath) {
            console.error('Error: routeList.json file path not specified.');
            console.error('Usage: w3 <routeList.json file path>');
            process.exit(1);
        }

    }

    async read() {
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