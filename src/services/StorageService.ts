import fs from 'fs';
import path from 'path';
import logger from '../lib/Logger';

export interface IWriteResult {
    filename: string;
    directory: string;
    filesize: number;
}

export default class StorageService {
    public static instance: StorageService;
    private directory: string

    constructor(dir = './.tmp') {
        logger.info("STORAGE_SERVICE_INIT", { dir });

        // Convert the directory to a fully valid path
        this.directory = path.resolve(dir);
        logger.info("STORAGE_SERVICE_PATH_BUILT", { dir: this.directory });

        // Check if the directory exists
        if(!fs.existsSync(this.directory)) {
            // If it doesn't exist, throw
            throw new Error(`Directory ${this.directory} does not exist.`);
        }
    }

    public getSingleton(): StorageService {
        if(!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    public async write(filename: string, data: Buffer): Promise<IWriteResult> {
        logger.info("STORAGE_WRITE_START", { filename, size: data.byteLength });

        try {
            // Check if the file exists
            const exists = fs.existsSync(path.join(this.directory, filename));
            if(exists) {
                // If it does, throw
                throw new Error(`File ${filename} already exists.`);
            }

            // Write the file
            fs.writeFileSync(path.join(this.directory, filename), data);
        } catch(err) {
            throw err;
        }

        const result: IWriteResult = {
            directory: this.directory,
            filename, 
            filesize: data.byteLength
        };

        logger.info("STORAGE_WRITE_SUCCESS", result);

        return result;

    }
}