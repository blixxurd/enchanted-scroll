// Load dotenv
import * as dotenv from "dotenv";
import { PDFOptions} from 'puppeteer';
dotenv.config();

interface IEnchantedScrollConfig {
    httpPort: number;
    htmlFilePath?: string;
    htmlString?: string;
    fileName: string;
    pdfOptions: PDFOptions;
}

const config: IEnchantedScrollConfig = {
    httpPort: Number(process.env.HTTP_PORT || "3000"),
    htmlFilePath: process.env.HTML_FILE_PATH || undefined,
    htmlString: process.env.HTML_STRING || undefined,
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

export default config;

export { IEnchantedScrollConfig };