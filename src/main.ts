// Initialize configuration and local logger
import config, { IEnchantedScrollConfig } from "./config";
import logger from "./lib/Logger";

// Import Required Services
import HTTPService from "./services/HTTPService";
import PDFGeneratorService, { IFile } from "./services/PDFGeneratorService";

async function main(cfg: IEnchantedScrollConfig = config): Promise<IFile> {
    // Initialize the backing services.
    const httpService = new HTTPService({ 
        htmlFilePath: cfg.htmlFilePath,
        htmlString: cfg.htmlString
    });
    const pdfGenerator = new PDFGeneratorService();

    // Start the HTTP service
    await httpService.start(cfg.httpPort);

    // Generate the PDF from the HTTP service
    const file = await pdfGenerator.generatePDF({
        url: `http://localhost:${cfg.httpPort}`,
        filename: cfg.fileName,
        options: cfg.pdfOptions
    });
    logger.info("PDF_GENERATED", file);
    return file;
}

export default main;
export { IEnchantedScrollConfig, IFile as IEnchantedScrollFile }

main();


