/// <reference types="node" />
/// <reference types="node" />
import { IAppConfig } from "./config";
import PDFGeneratorService, { IFile } from "./services/PDFGeneratorService";
declare enum EnchantedScrollOutputType {
    BUFFER = "buffer",
    FILE = "file"
}
interface IGenerateParams {
    htmlFilePath?: string;
    htmlString?: string;
}
interface IFileGenerateParams extends IGenerateParams {
    fileName?: string;
}
export default class EnchantedScroll {
    config: IAppConfig;
    outputType: EnchantedScrollOutputType;
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
    generate(params?: {
        htmlFilePath?: string;
        htmlString?: string;
        fileName?: string;
    }): Promise<Buffer | IFile>;
}
export { IAppConfig as IEnchantedScrollConfig, IFile as IEnchantedScrollFile, IGenerateParams, IFileGenerateParams };
