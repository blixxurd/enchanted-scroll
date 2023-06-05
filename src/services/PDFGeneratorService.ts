import logger from "../lib/Logger";
import Puppeteer from "../lib/Puppeteer";
import StorageService from "../services/StorageService";
import { PDFOptions} from 'puppeteer';
import crypto from "crypto";

interface IFileIdentity {
    id: string;
    filename: string;
    filename_original: string;
    filename_slug: string;
}

interface IFile extends IFileIdentity {
    size: number;
    created_at: Date;
}

interface IGeneratePDFBufferRequest {
    url: string;
    options: PDFOptions;
}

interface IGeneratePDFFileRequest extends IGeneratePDFBufferRequest {
    filename: string;
    outputDir?: string;
}

export default class PDFGeneratorService {
    /**
     * A service that generates PDFs and saves them to disk.
     */
    constructor(
        private puppeteer: Puppeteer = new Puppeteer(),
    ) {}

    /**
     * Converts a string to a slug.
     */
    private toSlug(str: string): string {
        return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    /**
     * Generate an object representing the fingerprint metadata of the file being generated and stored.
     */
    private generateFileIdentity(filename: string): IFileIdentity {
        // Generate a UUID
        const slug = this.toSlug(filename);
        return {
            id: crypto.randomUUID(),
            filename: `${slug}_${crypto.randomUUID()}.pdf`,
            filename_original: filename,
            filename_slug: slug
        }
    }

    /**
     * Generate a PDF from a URL, and save it to the disk. Accepts a filename and PDF formatting options.
     */
    public async generatePDFFile(req: IGeneratePDFFileRequest): Promise<IFile> {
        const { url, filename, options } = req;
        const storage = StorageService.getSingleton(req.outputDir);

        logger.info("PDF_GENERATOR_START", { url, filename });

        // Generate the file identity
        const fileIdentity = this.generateFileIdentity(filename);

        const pdf = await this.puppeteer.generatePDF(url, options);
        const result = await storage.write(fileIdentity.filename, pdf);
        
        return {
            ...fileIdentity,
            size: result.filesize,
            created_at: new Date()
        };
    }

    /**
     * Generate a PDF from a URL, and return it as a buffer. Accepts a filename and PDF formatting options.
     */
    public async generatePDFBuffer(req: IGeneratePDFBufferRequest): Promise<Buffer> {
        const { url, options } = req;

        logger.info("PDF_GENERATOR_START", { url });

        const pdf = await this.puppeteer.generatePDF(url, options);
        return pdf;
    }
    
}

export { IFile, IFileIdentity, IGeneratePDFFileRequest, IGeneratePDFBufferRequest };