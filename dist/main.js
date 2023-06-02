"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Initialize configuration and local logger
const config_1 = __importStar(require("./config"));
const Logger_1 = __importDefault(require("./lib/Logger"));
// Import Required Services
const HTTPService_1 = __importDefault(require("./services/HTTPService"));
const PDFGeneratorService_1 = __importDefault(require("./services/PDFGeneratorService"));
class EnchantedScroll {
    config;
    outputType;
    logger;
    constructor(config = config_1.default) {
        this.config = config;
        // If the output directory is set, we should output to a file.
        this.logger = Logger_1.default;
        this.outputType = config.outputType || config_1.OutputType.BUFFER;
        if (this.config.outputDirectory) {
            this.outputType = config_1.OutputType.FILE;
        }
        if (this.outputType === config_1.OutputType.FILE && !this.config.outputDirectory) {
            throw new Error("outputDirectory is required when outputType is set to file.");
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
    async toPDFBlob(params = {}) {
        const buffer = await this.toPDFBuffer(params);
        return new Blob([buffer], { type: 'application/pdf' });
    }
    async generate(params = {}) {
        if (this.outputType === config_1.OutputType.BUFFER) {
            return await this.toPDFBuffer(params);
        }
        else if (this.outputType === config_1.OutputType.BLOB) {
            return await this.toPDFBlob(params);
        }
        return await this.toPDFFile(params);
    }
}
exports.default = EnchantedScroll;
