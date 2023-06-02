"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Initialize configuration and local logger
const config_1 = __importDefault(require("./config"));
const Logger_1 = __importDefault(require("./lib/Logger"));
// Import Required Services
const HTTPService_1 = __importDefault(require("./services/HTTPService"));
const PDFGeneratorService_1 = __importDefault(require("./services/PDFGeneratorService"));
var EnchantedScrollOutputType;
(function (EnchantedScrollOutputType) {
    EnchantedScrollOutputType["BUFFER"] = "buffer";
    EnchantedScrollOutputType["FILE"] = "file";
})(EnchantedScrollOutputType || (EnchantedScrollOutputType = {}));
class EnchantedScroll {
    config;
    outputType = EnchantedScrollOutputType.BUFFER;
    logger;
    constructor(config = config_1.default) {
        this.config = config;
        // If the output directory is set, we should output to a file.
        this.logger = Logger_1.default;
        if (this.config.outputDirectory) {
            this.outputType = EnchantedScrollOutputType.FILE;
        }
        this.logger.info("ENCHANTED_SCROLL_INIT", config);
    }
    async init(params = {}) {
        // Initialize the backing services & create a base generate request
        const httpService = new HTTPService_1.default({
            htmlFilePath: params.htmlFilePath,
            htmlString: params.htmlString,
            port: this.config.httpPort || config_1.default.httpPort
        });
        const pdfGenerator = new PDFGeneratorService_1.default();
        const baseRequest = {
            url: `http://localhost:${httpService.port}`,
            options: this.config.pdfOptions || config_1.default.pdfOptions
        };
        // Start the HTTP service
        const server = await httpService.start();
        return {
            server, baseRequest, pdfGenerator
        };
    }
    async toPDFBuffer(params = {}) {
        const { server, pdfGenerator, baseRequest } = await this.init(params);
        // Generate with base config 
        const buffer = await pdfGenerator.generatePDFBuffer(baseRequest);
        this.logger.info("PDF_GENERATED", { size: buffer.byteLength });
        // Close all connections & close the server 
        server.closeAllConnections();
        server.close();
        return buffer;
    }
    async toPDFFile(params = {}) {
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
    async generate(params = {}) {
        if (this.outputType === EnchantedScrollOutputType.BUFFER) {
            return await this.toPDFBuffer(params);
        }
        return await this.toPDFFile(params);
    }
}
exports.default = EnchantedScroll;
