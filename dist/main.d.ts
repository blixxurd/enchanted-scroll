/// <reference types="node" />
import { IAppConfig, OutputType } from "./config";
import HTTPService from "./services/HTTPService";
import PDFGeneratorService, { IFile } from "./services/PDFGeneratorService";
interface IGenerateParams {
    url?: string;
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
    httpService?: HTTPService;
    constructor(config?: IAppConfig);
    private cleanup;
    init(params?: IGenerateParams): Promise<{
        baseRequest: {
            url: string;
            options: import("puppeteer").PDFOptions;
        };
        pdfGenerator: PDFGeneratorService;
    }>;
    toPDFBuffer(params?: IGenerateParams): Promise<Buffer>;
    toPDFFile(params?: IFileGenerateParams): Promise<IFile>;
    toPDFBlob(params?: IGenerateParams): Promise<Blob>;
    generate(params?: IFileGenerateParams | IGenerateParams): Promise<Buffer | IFile | Blob>;
}
export { IAppConfig as IEnchantedScrollConfig, IFile as IEnchantedScrollFile, IGenerateParams, IFileGenerateParams };
