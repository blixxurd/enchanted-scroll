"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../lib/Logger"));
const Puppeteer_1 = __importDefault(require("../lib/Puppeteer"));
const StorageService_1 = __importDefault(require("../services/StorageService"));
const crypto_1 = __importDefault(require("crypto"));
class PDFGeneratorService {
    puppeteer;
    storage;
    /**
     * A service that generates PDFs and saves them to disk.
     */
    constructor(puppeteer = new Puppeteer_1.default(), storage = new StorageService_1.default().getSingleton()) {
        this.puppeteer = puppeteer;
        this.storage = storage;
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
    async generatePDFFile(req) {
        const { url, filename, options } = req;
        Logger_1.default.info("PDF_GENERATOR_START", { url, filename });
        // Generate the file identity
        const fileIdentity = this.generateFileIdentity(filename);
        const pdf = await this.puppeteer.generatePDF(url, options);
        const result = await this.storage.write(fileIdentity.filename, pdf);
        return {
            ...fileIdentity,
            size: result.filesize,
            created_at: new Date()
        };
    }
    /**
     * Generate a PDF from a URL, and return it as a buffer. Accepts a filename and PDF formatting options.
     */
    async generatePDFBuffer(req) {
        const { url, options } = req;
        Logger_1.default.info("PDF_GENERATOR_START", { url });
        const pdf = await this.puppeteer.generatePDF(url, options);
        return pdf;
    }
}
exports.default = PDFGeneratorService;
