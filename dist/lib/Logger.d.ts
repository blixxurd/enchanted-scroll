interface LogPayload {
    message: string;
    data?: object;
}
interface LogOutput {
    message: string;
    data?: object;
    timestamp: Date;
    level?: string;
}
declare enum LogLevel {
    INFO = "info",
    WARN = "warn"
}
declare class Logger {
    static instance: Logger;
    verbose: boolean;
    enabled: boolean;
    constructor();
    static getSingleton(): Logger;
    log(payload: LogPayload, level?: LogLevel): void;
    info(message: string, data?: object): void;
    warn(message: string, data?: object): void;
}
export { LogPayload, LogOutput, LogLevel, Logger };
declare const _default: Logger;
export default _default;
