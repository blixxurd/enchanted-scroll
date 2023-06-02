// Load dotenv
import * as dotenv from "dotenv";
import { PDFOptions} from 'puppeteer';
dotenv.config();

enum OutputType {
    BUFFER = "buffer",
    BLOB = "blob",
    FILE = "file"
}

interface IAppConfig {
    httpPort?: number;
    pdfOptions?: PDFOptions;
    outputDirectory?: string;
    outputType?: OutputType;
}

interface IAppBaseConfig {
    httpPort: number;
    pdfOptions: PDFOptions;
}

const baseConfig: IAppBaseConfig = {
    httpPort: 3000,
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

export default baseConfig;
export { IAppConfig, OutputType };