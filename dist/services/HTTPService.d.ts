/// <reference types="node" />
import koa from 'koa';
interface IHTTPServiceConfig {
    htmlFilePath?: string;
    htmlString?: string;
    port: number;
}
export default class HTTPService {
    app: koa;
    port: number;
    filePath: string | undefined;
    htmlString: string | undefined;
    /**
     * A small HTTP server that serves a single HTML file.
     * @param htmlFilePath The path to the HTML file to serve.
     */
    constructor(params: IHTTPServiceConfig);
    /**
     * Start the HTTP server, to locally serve the HTML data specified in the constructor.
     */
    start(): Promise<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>>;
}
export { IHTTPServiceConfig };
