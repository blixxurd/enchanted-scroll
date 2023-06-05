/// <reference types="node" />
import Puppeteer from "../lib/Puppeteer";
import { PDFOptions } from 'puppeteer';
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
    private puppeteer;
    /**
     * A service that generates PDFs and saves them to disk.
     */
    constructor(puppeteer?: Puppeteer);
    /**
     * Converts a string to a slug.
     */
    private toSlug;
    /**
     * Generate an object representing the fingerprint metadata of the file being generated and stored.
     */
    private generateFileIdentity;
    /**
     * Generate a PDF from a URL, and save it to the disk. Accepts a filename and PDF formatting options.
     */
    generatePDFFile(req: IGeneratePDFFileRequest): Promise<IFile>;
    /**
     * Generate a PDF from a URL, and return it as a buffer. Accepts a filename and PDF formatting options.
     */
    generatePDFBuffer(req: IGeneratePDFBufferRequest): Promise<Buffer>;
}
export { IFile, IFileIdentity, IGeneratePDFFileRequest, IGeneratePDFBufferRequest };
