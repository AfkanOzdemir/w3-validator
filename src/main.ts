import getRawHtml from './getRawHtml';
import validateHtml from './validateHtml';
import validationParser from './validationParser';
import readRouteList from './readRouteList';
import templateCreator from './templateCreator';

class main {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const routeData: string[] = await new readRouteList(process.argv[2]).read();
      for (let i = 0; i < routeData.length; i++) {
        const url = routeData[i];

        console.log(`\n[${i + 1}/${routeData.length}] Validating: ${url}`);
        console.log('='.repeat(80));

        try {
          const rawHtmlInstance = new getRawHtml(url);
          const rawHtml = await rawHtmlInstance.init(url);
          console.log(`HTML fetched (${rawHtml.length} characters)`);

          const validationResult = new validateHtml(rawHtml, 3);
          const html = await validationResult.init();
          console.log('W3 validation completed successfully');

          const validationParserInstance = new validationParser(html);
          await validationParserInstance.parse();

          const results = validationParserInstance.result();
          console.log(results);

        } catch (error) {
          console.error(`\n❌ Error (${url}):`, error instanceof Error ? error.message : String(error));
          console.log('='.repeat(80));
          continue;
        }
      }

      console.log('\n' + '='.repeat(80));
      console.log('Validation completed for all routes!');

    } catch (error) {
      console.error("Critical Error:", error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }
}

export default main;

const isMainModule = process.argv[1] && (
  process.argv[1].endsWith('main.js') ||
  process.argv[1].endsWith('main.cjs') ||
  process.argv[1].endsWith('main.ts') ||
  process.argv[1].includes('w3validator') ||
  process.argv[1].includes('w3')
);

const isTemplateCreator = process.argv[2] === 'create-template';

if (isTemplateCreator) {
  (async () => {
    try {
      const creator = new templateCreator('routelist.json');
      await creator.create();
      process.exit(0);
    } catch (error) {
      console.error('❌ Failed to create template:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  })();
} else if (isMainModule) {
  new main();
}

export { getRawHtml, validateHtml, validationParser, readRouteList, templateCreator };