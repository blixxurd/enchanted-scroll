// Initialize configuration and local logger
import config, { IEnchantedScrollConfig } from "./config";
import logger from "./lib/Logger";

// Import Required Services
import HTTPService from "./services/HTTPService";
const httpService = new HTTPService(config.htmlFilePath);
import PDFGeneratorService, { IFile } from "./services/PDFGeneratorService";
const pdfGenerator = new PDFGeneratorService();

async function main(cfg: IEnchantedScrollConfig = config) {
    await httpService.start(cfg.httpPort);
    const file = await pdfGenerator.generatePDF({
        url: `http://localhost:${cfg.httpPort}`,
        filename: cfg.fileName,
        options: cfg.pdfOptions
    });
    logger.info("PDF_GENERATED", file);
}

// export default main;
// export { IEnchantedScrollConfig, IFile as IEnchantedScrollFile }


// Execute the program
(async () => {
    await main();
    process.exit(0);
})().catch(err => {
    console.error(err);
    // Exit the process with an error code
    process.exit(1);
})


