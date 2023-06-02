import { PDFOptions } from 'puppeteer';
declare enum OutputType {
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
declare const baseConfig: IAppBaseConfig;
export default baseConfig;
export { IAppConfig, OutputType };
