"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Logger_1 = __importDefault(require("../lib/Logger"));
class StorageService {
    static instance;
    directory;
    constructor(dir = './.tmp') {
        Logger_1.default.info("STORAGE_SERVICE_INIT", { dir });
        // Convert the directory to a fully valid path
        this.directory = path_1.default.resolve(dir);
        Logger_1.default.info("STORAGE_SERVICE_PATH_BUILT", { dir: this.directory });
        // Check if the directory exists
        if (!fs_1.default.existsSync(this.directory)) {
            // If it doesn't exist, throw
            throw new Error(`Directory ${this.directory} does not exist.`);
        }
    }
    getSingleton() {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }
    async write(filename, data) {
        Logger_1.default.info("STORAGE_WRITE_START", { filename, size: data.byteLength });
        try {
            // Check if the file exists
            const exists = fs_1.default.existsSync(path_1.default.join(this.directory, filename));
            if (exists) {
                // If it does, throw
                throw new Error(`File ${filename} already exists.`);
            }
            // Write the file
            fs_1.default.writeFileSync(path_1.default.join(this.directory, filename), data);
        }
        catch (err) {
            throw err;
        }
        const result = {
            directory: this.directory,
            filename,
            filesize: data.byteLength
        };
        Logger_1.default.info("STORAGE_WRITE_SUCCESS", result);
        return result;
    }
}
exports.default = StorageService;
