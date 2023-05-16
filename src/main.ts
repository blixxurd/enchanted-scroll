// Initialize configuration and local logger
import ESConfig, { IEnchantedScrollConfig } from "./config";
import ESLogger, { Logger } from "./lib/Logger";

// Import Required Services
import HTTPService from "./services/HTTPService";
import PDFGeneratorService, { IFile } from "./services/PDFGeneratorService";

interface IEnchantedScrollGenerateParams {
    htmlFilePath?: string;
    htmlString?: string;
    fileName?: string;
}

enum EnchantedScrollOutputType {
    BUFFER = "buffer",
    FILE = "file"
}

export default class EnchantedScroll {
    public outputType: EnchantedScrollOutputType = EnchantedScrollOutputType.BUFFER;

    constructor (
        public config: IEnchantedScrollConfig = ESConfig,
        private logger: Logger = ESLogger,
    ) {
        // If the output directory is set, we should output to a file.
        if(this.config.outputDirectory) {
            this.outputType = EnchantedScrollOutputType.FILE;
        }

        logger.info("ENCHANTED_SCROLL_INIT", config);
    }

    public async generate(params: IEnchantedScrollGenerateParams = {}) {
        // Initialize the backing services & create a base generate request
        const httpService = new HTTPService({ 
            htmlFilePath: params.htmlFilePath,
            htmlString: params.htmlString
        });
        const pdfGenerator = new PDFGeneratorService();
        const baseRequest = {
            url: `http://localhost:${this.config.httpPort}`,
            options: this.config.pdfOptions
        };

        // Start the HTTP service
        await httpService.start(this.config.httpPort);

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

export { IEnchantedScrollConfig, IFile as IEnchantedScrollFile }

// Test it
// import EnchantedScroll from "./EnchantedScroll";

const es = new EnchantedScroll({
    outputDirectory: "./.tmp"
});
es.generate({
    htmlFilePath: "./.tmp/test.html",
}).then((result) => {
    console.log(result);
}
).catch((err) => {
    console.error(err);
}
);

