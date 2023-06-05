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
// Load puppeteer
const puppeteer_1 = __importDefault(require("puppeteer"));
const Logger_1 = __importDefault(require("./Logger"));
class Puppeteer {
    generatePDF(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("PUPPETEER_INIT", { url, options });
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.goto(url);
            Logger_1.default.info("PUPPETEER_PAGE_LOADED", { url: page.url() });
            // Print as PDF && add configuration for high quality legal document
            const pdf = yield page.pdf(options);
            Logger_1.default.info("PUPPETEER_PDF_GENERATED", { size: pdf.byteLength });
            // Close the browser and exit
            yield browser.close();
            // Return the buffer
            return pdf;
        });
    }
}
exports.default = Puppeteer;
