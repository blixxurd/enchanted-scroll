"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load puppeteer
const puppeteer_1 = __importDefault(require("puppeteer"));
const Logger_1 = __importDefault(require("./Logger"));
class Puppeteer {
    async generatePDF(url, options) {
        Logger_1.default.info("PUPPETEER_INIT", { url, options });
        const browser = await puppeteer_1.default.launch();
        const page = await browser.newPage();
        await page.goto(url);
        Logger_1.default.info("PUPPETEER_PAGE_LOADED", { url: page.url() });
        // Print as PDF && add configuration for high quality legal document
        const pdf = await page.pdf(options);
        Logger_1.default.info("PUPPETEER_PDF_GENERATED", { size: pdf.byteLength });
        // Close the browser and exit
        await browser.close();
        // Return the buffer
        return pdf;
    }
}
exports.default = Puppeteer;
