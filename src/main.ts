// Initialize configuration and local logger
import config, { IEnchantedScrollConfig } from "./config";
import logger from "./lib/Logger";

// Import Required Services
import HTTPService from "./services/HTTPService";
const httpService = new HTTPService(config.htmlFilePath);
import PDFGeneratorService, { IFile as IEnchantedScrollFile } from "./services/PDFGeneratorService";
const pdfGenerator = new PDFGeneratorService();

async function main(cfg: IEnchantedScrollConfig = config): Promise<IEnchantedScrollFile> {
    await httpService.start(cfg.httpPort);
    const file = await pdfGenerator.generatePDF({
        url: `http://localhost:${cfg.httpPort}`,
        filename: cfg.fileName,
        options: cfg.pdfOptions
    });
    logger.info("PDF_GENERATED", file);
    return file;
}

export default main;
export { IEnchantedScrollConfig, IEnchantedScrollFile }


