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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Initialize configuration and local logger
const Logger_1 = __importDefault(require("./lib/Logger"));
const config_1 = __importStar(require("./config"));
// Import Required Services
const HTTPService_1 = __importDefault(require("./services/HTTPService"));
const PDFGeneratorService_1 = __importDefault(require("./services/PDFGeneratorService"));
class EnchantedScroll {
    constructor(config = config_1.default) {
        this.config = config;
        // Initialize the logger
        this.logger = Logger_1.default;
        this.logger.enabled = config.logging || config_1.default.logging;
        // If the output directory is set, we should output to a file.
        this.outputType = config.outputType || config_1.OutputType.BUFFER;
        if (this.outputType === config_1.OutputType.FILE && !this.config.outputDirectory) {
            throw new Error("outputDirectory is required when outputType is set to file.");
        }
        this.logger.info("ENCHANTED_SCROLL_INIT", config);
    }
    init(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const server = yield httpService.start();
            return {
                server, baseRequest, pdfGenerator
            };
        });
    }
    toPDFBuffer(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { server, pdfGenerator, baseRequest } = yield this.init(params);
            // Generate with base config 
            const buffer = yield pdfGenerator.generatePDFBuffer(baseRequest).finally(() => {
                // Close all connections & close the server
                server.closeAllConnections();
                server.close();
            });
            this.logger.info("PDF_GENERATED", { size: buffer.byteLength });
            return buffer;
        });
    }
    toPDFFile(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { server, pdfGenerator, baseRequest } = yield this.init(params);
            // If File, return the file as an IFile type
            const file = yield pdfGenerator.generatePDFFile(Object.assign(Object.assign({}, baseRequest), { filename: params.fileName || "document", outputDir: this.config.outputDirectory })).finally(() => {
                // Close all connections & close the server
                server.closeAllConnections();
                server.close();
            });
            this.logger.info("PDF_GENERATED", file);
            return file;
        });
    }
    toPDFBlob(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this.toPDFBuffer(params);
            return new Blob([buffer], { type: 'application/pdf' });
        });
    }
    generate(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.outputType === config_1.OutputType.BUFFER) {
                return yield this.toPDFBuffer(params);
            }
            else if (this.outputType === config_1.OutputType.BLOB) {
                return yield this.toPDFBlob(params);
            }
            return yield this.toPDFFile(params);
        });
    }
}
exports.default = EnchantedScroll;
