// Load puppeteer
import puppeteer, { PDFOptions} from 'puppeteer';
import logger from './Logger';

export default class Puppeteer {

    public async generatePDF(url: string, options: PDFOptions) : Promise<Buffer> {
        logger.info("PUPPETEER_INIT", { url, options });
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.goto(url);

        logger.info("PUPPETEER_PAGE_LOADED", { url: page.url() });

        // Print as PDF && add configuration for high quality legal document
        const pdf = await page.pdf(options);

        logger.info("PUPPETEER_PDF_GENERATED", { size: pdf.byteLength });

        // Close the browser and exit
        await browser.close();

        // Return the buffer
        return pdf;
    }

}