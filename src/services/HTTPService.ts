import koa, { Context } from 'koa';
import path from 'path';
import fs from 'fs';
import logger from "../lib/Logger";


export default class HTTPService {
    public app: koa;
    public filePath: string;
    public port: number;
    
    /**
     * A small HTTP server that serves a single HTML file.
     * @param htmlFilePath The path to the HTML file to serve.
     */
    constructor (htmlFilePath: string) {
        this.port = 0; // Default to 0 so we can check if the server is running
        this.app = new koa();
        this.filePath = path.join(htmlFilePath);
        this.app.use(async (ctx: Context) => {
            ctx.type = 'html';
            ctx.body = fs.createReadStream(this.filePath);
        });
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
        if(!fs.existsSync(this.filePath)) {
            logger.warn("HTTP_FILE_NOT_FOUND", { path: this.filePath });
            throw new Error(`File ${this.filePath} does not exist.`);
        }
        
        this.app.use(async (ctx: Context) => {
            const html = fs.readFileSync(this.filePath, 'utf8');
            ctx.body = html;
            ctx.type = 'html';
        });
          
        this.app.listen(port, () => {
            logger.info("HTTP_SERVER_STARTED", { port });
            return Promise.resolve();
        });
    }
}