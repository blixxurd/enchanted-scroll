/// <reference types="node" />
/// <reference types="node" />
import { IAppConfig, OutputType } from "./config";
import PDFGeneratorService, { IFile } from "./services/PDFGeneratorService";
interface IGenerateParams {
    htmlFilePath?: string;
    htmlString?: string;
}
interface IFileGenerateParams extends IGenerateParams {
    fileName?: string;
}
export default class EnchantedScroll {
    config: IAppConfig;
    outputType: OutputType;
    private logger;
    constructor(config?: IAppConfig);
    init(params?: IGenerateParams): Promise<{
        server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
        baseRequest: {
            url: string;
            options: import("puppeteer").PDFOptions;
        };
        pdfGenerator: PDFGeneratorService;
    }>;
    toPDFBuffer(params?: IGenerateParams): Promise<Buffer>;
    toPDFFile(params?: IFileGenerateParams): Promise<IFile>;
    toPDFBlob(params?: IGenerateParams): Promise<Blob>;
    generate(params?: {
        htmlFilePath?: string;
        htmlString?: string;
        fileName?: string;
    }): Promise<Buffer | IFile | Blob>;
}
export { IAppConfig as IEnchantedScrollConfig, IFile as IEnchantedScrollFile, IGenerateParams, IFileGenerateParams };
