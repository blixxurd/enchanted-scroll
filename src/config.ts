// Load dotenv
import * as dotenv from "dotenv";
import { PDFOptions} from 'puppeteer';
dotenv.config();

interface IAppConfig {
    httpPort?: number;
    pdfOptions?: PDFOptions;
    outputDirectory?: string;
}

const appConfig: IAppConfig = {
    httpPort: Number(process.env.HTTP_PORT || "3000"),
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
    },
};

export default appConfig;
export { IAppConfig as IEnchantedScrollConfig };