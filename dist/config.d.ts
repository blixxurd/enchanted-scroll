import { PDFOptions } from 'puppeteer';
interface IAppConfig {
    httpPort?: number;
    pdfOptions?: PDFOptions;
    outputDirectory?: string;
}
interface IAppBaseConfig {
    httpPort: number;
    pdfOptions: PDFOptions;
}
declare const baseConfig: IAppBaseConfig;
export default baseConfig;
export { IAppConfig };
