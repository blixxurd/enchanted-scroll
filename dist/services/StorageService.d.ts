/// <reference types="node" />
export interface IWriteResult {
    filename: string;
    directory: string;
    filesize: number;
}
export default class StorageService {
    static instance: StorageService;
    private directory;
    constructor(dir?: string);
    getSingleton(): StorageService;
    write(filename: string, data: Buffer): Promise<IWriteResult>;
}
