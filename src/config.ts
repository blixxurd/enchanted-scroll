// Load dotenv
import * as dotenv from "dotenv";
import { PDFOptions} from 'puppeteer';
dotenv.config();

interface IEnchantedScrollConfig {
    httpPort: number;
    htmlFilePath: string;
    fileName: string;
    pdfOptions: PDFOptions;
}

const config: IEnchantedScrollConfig = {
    httpPort: Number(process.env.HTTP_PORT || "3000"),
    htmlFilePath: process.env.HTML_FILE_PATH || "./.tmp/test.html",
    fileName: process.env.FILE_NAME || "generated-file",
    pdfOptions: {
        format: 'A4',
        margin: {
            top: '1cm',
            bottom: '1cm',
            left: '1cm',
            right: '1cm'
        },
        printBackground: false,
        omitBackground: true,
    }
};

if(!config.htmlFilePath) {
    throw new Error("HTML_FILE_PATH is required.");
}

export default config;

export { IEnchantedScrollConfig };