"use strict";
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
const Logger_1 = __importDefault(require("../lib/Logger"));
const Puppeteer_1 = __importDefault(require("../lib/Puppeteer"));
const StorageService_1 = __importDefault(require("../services/StorageService"));
const crypto_1 = __importDefault(require("crypto"));
class PDFGeneratorService {
    /**
     * A service that generates PDFs and saves them to disk.
     */
    constructor(puppeteer = new Puppeteer_1.default()) {
        this.puppeteer = puppeteer;
    }
    /**
     * Converts a string to a slug.
     */
    toSlug(str) {
        return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    /**
     * Generate an object representing the fingerprint metadata of the file being generated and stored.
     */
    generateFileIdentity(filename) {
        // Generate a UUID
        const slug = this.toSlug(filename);
        return {
            id: crypto_1.default.randomUUID(),
            filename: `${slug}_${crypto_1.default.randomUUID()}.pdf`,
            filename_original: filename,
            filename_slug: slug
        };
    }
    /**
     * Generate a PDF from a URL, and save it to the disk. Accepts a filename and PDF formatting options.
     */
    generatePDFFile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, filename, options } = req;
            const storage = StorageService_1.default.getSingleton(req.outputDir);
            Logger_1.default.info("PDF_GENERATOR_START", { url, filename });
            // Generate the file identity
            const fileIdentity = this.generateFileIdentity(filename);
            const pdf = yield this.puppeteer.generatePDF(url, options);
            const result = yield storage.write(fileIdentity.filename, pdf);
            return Object.assign(Object.assign({}, fileIdentity), { size: result.filesize, created_at: new Date() });
        });
    }
    /**
     * Generate a PDF from a URL, and return it as a buffer. Accepts a filename and PDF formatting options.
     */
    generatePDFBuffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, options } = req;
            Logger_1.default.info("PDF_GENERATOR_START", { url });
            const pdf = yield this.puppeteer.generatePDF(url, options);
            return pdf;
        });
    }
}
exports.default = PDFGeneratorService;
