"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Logger_1 = __importDefault(require("../lib/Logger"));
class HTTPService {
    /**
     * A small HTTP server that serves a single HTML file.
     * @param htmlFilePath The path to the HTML file to serve.
     */
    constructor(params) {
        const { htmlFilePath, htmlString } = params;
        Logger_1.default.info("HTTP_SERVICE_INIT", { htmlFilePath, htmlString });
        if (!htmlFilePath && !htmlString) {
            throw new Error("Either htmlFilePath or htmlString is required.");
        }
        if (htmlFilePath && htmlString) {
            throw new Error("Only one of htmlFilePath or htmlString is allowed.");
        }
        if (htmlFilePath) {
            this.filePath = path_1.default.join(htmlFilePath);
        }
        else {
            this.htmlString = htmlString;
        }
        this.port = params.port;
        this.app = new koa_1.default();
    }
    /**
     * Start the HTTP server, to locally serve the HTML data specified in the constructor.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // Intentionally not throwing an error if the file doesn't exist.
            // Since this is not a long running service, it's okay to fail at runtime.
            // In fact, for our use case, it's better to fail on runtime than to fail on request.
            let body = this.htmlString;
            if (this.filePath) {
                if (!fs_1.default.existsSync(this.filePath)) {
                    Logger_1.default.warn("HTTP_FILE_NOT_FOUND", { path: this.filePath });
                    throw new Error(`File ${this.filePath} does not exist.`);
                }
                body = fs_1.default.readFileSync(this.filePath, 'utf8');
            }
            this.app.use((ctx) => __awaiter(this, void 0, void 0, function* () {
                ctx.body = body;
                ctx.type = 'html';
            }));
            return this.app.listen(this.port);
        });
    }
}
exports.default = HTTPService;
