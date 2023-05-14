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
enum LogLevel {
    INFO = "info",
    WARN = "warn",
}

class Logger {
    public static instance: Logger;
    public verbose = true;

    constructor() {
        if(Logger.instance) {
            throw new Error("Logger is a singleton. Use Logger.getInstance() instead.");
        }
    }

    public getSingleton(): Logger {
        if(!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log(payload: LogPayload, level: LogLevel = LogLevel.INFO): void {
        const output: LogOutput = {
            message: payload.message,
            data: payload.data,
            timestamp: new Date(),
            level
        };

        // If verbose is false, only log the output message
        if(!this.verbose) {
            console.log(output.message);
            return;
        }

        console.log(output);
    }

    public info(message: string, data?: object): void {
        this.log({ message, data }, LogLevel.INFO);
    }

    public warn(message: string, data?: object): void {
        this.log({ message, data }, LogLevel.WARN);
    }
}

export { LogPayload, LogOutput, LogLevel, Logger };
export default new Logger().getSingleton();