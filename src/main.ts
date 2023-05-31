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

interface IGenerateParams {
    htmlFilePath?: string; 
    htmlString?: string; 
}

interface IFileGenerateParams extends IGenerateParams {
    fileName?: string; 
}

export default class EnchantedScroll {
    public outputType: EnchantedScrollOutputType = EnchantedScrollOutputType.BUFFER;
    private logger: Logger;

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

    public async init(params: IGenerateParams = {}) {
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
        const server = await httpService.start();

        return {
            server, baseRequest, pdfGenerator
        }
    }

    public async toPDFBuffer(params: IGenerateParams = {}): Promise<Buffer> {
        const { server, pdfGenerator, baseRequest } = await this.init(params);

        // Generate with base config 
        const buffer = await pdfGenerator.generatePDFBuffer(baseRequest);
        this.logger.info("PDF_GENERATED", { size: buffer.byteLength });

        // Close all connections & close the server 
        server.closeAllConnections();
        server.close();

        return buffer;
    }

    public async toPDFFile(params: IFileGenerateParams = {}): Promise<IFile> {
        const { server, pdfGenerator, baseRequest } = await this.init(params);

        // If File, return the file as an IFile type
        const file = await pdfGenerator.generatePDFFile({
            ...baseRequest,
            filename: params.fileName || "document",
        });
        this.logger.info("PDF_GENERATED", file);

        // Close all connections & closer the server 
        server.closeAllConnections();
        server.close();

        return file;
    }

    public async generate(params: { htmlFilePath?: string; htmlString?: string; fileName?: string; } = {}): Promise<Buffer|IFile> {
        if(this.outputType === EnchantedScrollOutputType.BUFFER) {
            return await this.toPDFBuffer(params) as Buffer;
        }

        return await this.toPDFFile(params) as IFile;
    }
    
} 

export { 
    IAppConfig as IEnchantedScrollConfig, 
    IFile as IEnchantedScrollFile,
    IGenerateParams,
    IFileGenerateParams
}
