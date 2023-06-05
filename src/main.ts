// Initialize configuration and local logger
import ESLogger, { Logger } from "./lib/Logger";
import ESBaseConfig, { IAppConfig, OutputType } from "./config";

// Import Required Services
import HTTPService from "./services/HTTPService";
import PDFGeneratorService, { IFile } from "./services/PDFGeneratorService";

interface IGenerateParams {
    htmlFilePath?: string; 
    htmlString?: string; 
}

interface IFileGenerateParams extends IGenerateParams {
    fileName?: string; 
}

export default class EnchantedScroll {
    public outputType: OutputType;
    private logger: Logger;

    constructor (
        public config: IAppConfig = ESBaseConfig,
    ) {
        // Initialize the logger
        this.logger = ESLogger;
        this.logger.enabled = config.logging || ESBaseConfig.logging;

        // If the output directory is set, we should output to a file.
        this.outputType = config.outputType || OutputType.BUFFER;

        if(this.outputType === OutputType.FILE && !this.config.outputDirectory) {
            throw new Error("outputDirectory is required when outputType is set to file.");
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
        const buffer = await pdfGenerator.generatePDFBuffer(baseRequest).finally(() => {
            // Close all connections & close the server
            server.closeAllConnections();
            server.close();
        });
        this.logger.info("PDF_GENERATED", { size: buffer.byteLength });

        return buffer;
    }

    public async toPDFFile(params: IFileGenerateParams = {}): Promise<IFile> {
        const { server, pdfGenerator, baseRequest } = await this.init(params);

        // If File, return the file as an IFile type
        const file = await pdfGenerator.generatePDFFile({
            ...baseRequest,
            filename: params.fileName || "document",
            outputDir: this.config.outputDirectory
        }).finally(() => {
            // Close all connections & close the server
            server.closeAllConnections();
            server.close();
        });
        
        this.logger.info("PDF_GENERATED", file);

        return file;
    }

    public async toPDFBlob(params: IGenerateParams = {}): Promise<Blob> {
        const buffer = await this.toPDFBuffer(params);
        return new Blob([buffer], { type: 'application/pdf' });
    }

    public async generate(params: { htmlFilePath?: string; htmlString?: string; fileName?: string; } = {}): Promise<Buffer|IFile|Blob> {
        if(this.outputType === OutputType.BUFFER) {
            return await this.toPDFBuffer(params) as Buffer;
        } else if(this.outputType === OutputType.BLOB) {
            return await this.toPDFBlob(params) as Blob;
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
