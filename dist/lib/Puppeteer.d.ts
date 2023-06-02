/// <reference types="node" />
import { PDFOptions } from 'puppeteer';
export default class Puppeteer {
    generatePDF(url: string, options: PDFOptions): Promise<Buffer>;
}
