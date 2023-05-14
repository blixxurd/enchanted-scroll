import koa, { Context } from 'koa';
import path from 'path';
import fs from 'fs';
import logger from "../lib/Logger";

interface IHTTPServiceConfig {
    htmlFilePath?: string;
    htmlString?: string;
}
    

export default class HTTPService {
    public app: koa;
    public port = 0;
    public filePath: string|undefined;
    public htmlString: string|undefined;
    
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

        this.app = new koa();
    }

    /**
     * Start the HTTP server, to locally serve the HTML file specified in the constructor.
     * @param port The port to listen on.
     */
    public async start(port: number): Promise<void> {
        // Intentionally not throwing an error if the file doesn't exist.
        // Since this is not a long running service, it's okay to fail at runtime.
        // In fact, for our use case, it's better to fail on runtime than to fail on request.
        this.port = port;
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
          
        this.app.listen(port, () => {
            logger.info("HTTP_SERVER_STARTED", { port });
            return Promise.resolve();
        });
    }
}

export { IHTTPServiceConfig };