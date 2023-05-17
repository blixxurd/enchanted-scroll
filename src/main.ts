// Initialize configuration and local logger
import ESBaseConfig, { IAppConfig } from "./config";
import ESLogger, { Logger } from "./lib/Logger";

// Import Required Services
import HTTPService from "./services/HTTPService";
import PDFGeneratorService, { IFile } from "./services/PDFGeneratorService";


enum EnchantedScrollOutputType {
    BUFFER = "buffer",
    FILE = "file"
}

export default class EnchantedScroll {
    public outputType: EnchantedScrollOutputType = EnchantedScrollOutputType.BUFFER;
    private logger : Logger;

    constructor (
        public config: IAppConfig = ESBaseConfig,
    ) {
        // If the output directory is set, we should output to a file.
        this.logger = ESLogger;
        if(this.config.outputDirectory) {
            this.outputType = EnchantedScrollOutputType.FILE;
        }

        this.logger.info("ENCHANTED_SCROLL_INIT", config);
    }

    public async generate(params: { htmlFilePath?: string; htmlString?: string; fileName?: string; } = {}) {
        // Initialize the backing services & create a base generate request
        const httpService = new HTTPService({ 
            htmlFilePath: params.htmlFilePath,
            htmlString: params.htmlString,
            port: this.config.httpPort || ESBaseConfig.httpPort
        });
        const pdfGenerator = new PDFGeneratorService();
        const baseRequest = {
            url: `http://localhost:${httpService.port}`,
            options: this.config.pdfOptions || ESBaseConfig.pdfOptions
        };

        // Start the HTTP service
        await httpService.start();

        // Generate the PDF from the HTTP service
        // If Buffer, return the buffer as a Buffer type
        if(this.outputType === EnchantedScrollOutputType.BUFFER) {
            const buffer = await pdfGenerator.generatePDFBuffer(baseRequest);
            this.logger.info("PDF_GENERATED", { size: buffer.byteLength });
            return buffer as Buffer;
        }

        // If File, return the file as an IFile type
        const file = await pdfGenerator.generatePDFFile({
            ...baseRequest,
            filename: params.fileName || "document",
        });
        this.logger.info("PDF_GENERATED", file);
        return file as IFile;
    }
    
} 

export { IAppConfig as IEnchantedScrollConfig, IFile as IEnchantedScrollFile }
