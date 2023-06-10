import koa, { Context } from 'koa';
import path from 'path';
import fs from 'fs';
import logger from "../lib/Logger";
import { Server } from 'http';

interface IHTTPServiceConfig {
    htmlFilePath?: string;
    htmlString?: string;
    port: number;
}

export default class HTTPService {
    public app: koa;
    public port: number;
    public filePath: string|undefined;
    public htmlString: string|undefined;
    public server: Server | undefined = undefined;
    /**
     * A small HTTP server that serves a single HTML file.
     * @param htmlFilePath The path to the HTML file to serve.
     */
    constructor (params: IHTTPServiceConfig) {

        const { htmlFilePath, htmlString } = params;
        logger.info("HTTP_SERVICE_INIT", { htmlFilePath, htmlString });

        if(!htmlFilePath && !htmlString) {
            throw new Error("Either htmlFilePath or htmlString is required.");
        }
        if(htmlFilePath && htmlString) {
            throw new Error("Only one of htmlFilePath or htmlString is allowed.");
        }
        if(htmlFilePath) {
            this.filePath = path.join(htmlFilePath);
        } else {
            this.htmlString = htmlString;
        }

        this.port = params.port;
        this.app = new koa();
    }

    /**
     * Start the HTTP server, to locally serve the HTML data specified in the constructor.
     */
    public async start() {
        // Intentionally not throwing an error if the file doesn't exist.
        // Since this is not a long running service, it's okay to fail at runtime.
        // In fact, for our use case, it's better to fail on runtime than to fail on request.
        let body = this.htmlString;
        if(this.filePath) {
            if(!fs.existsSync(this.filePath)) {
                logger.warn("HTTP_FILE_NOT_FOUND", { path: this.filePath });
                throw new Error(`File ${this.filePath} does not exist.`);
            }
            body = fs.readFileSync(this.filePath, 'utf8');
        }
        
        this.app.use(async (ctx: Context) => {
            ctx.body = body;
            ctx.type = 'html';
        });

        this.server = this.app.listen(this.port);

        return this.server;
    }

    /**
     * Stop the HTTP server.
     */
    public stop() {
        return new Promise((resolve, reject) => {
            if(this.server && this.server.listening) {
                this.server.closeAllConnections();
                this.server.close((err) => {
                    if(err) {
                        return reject(err);
                    }
                    logger.info("HTTP_SERVICE_STOPPED", { port: this.port });
                    return resolve({
                        port: this.port,
                        server: this.server
                    });
                });
            }
            return resolve({
                port: this.port,
                server: this.server
            });
        });
    }

}

export { IHTTPServiceConfig };