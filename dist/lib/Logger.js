"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
})(LogLevel || (LogLevel = {}));
exports.LogLevel = LogLevel;
class Logger {
    static instance;
    verbose = true;
    constructor() {
        if (Logger.instance) {
            throw new Error("Logger is a singleton. Use Logger.getInstance() instead.");
        }
    }
    getSingleton() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    log(payload, level = LogLevel.INFO) {
        const output = {
            message: payload.message,
            data: payload.data,
            timestamp: new Date(),
            level
        };
        // If verbose is false, only log the output message
        if (!this.verbose) {
            console.log(output.message);
            return;
        }
        console.log(output);
    }
    info(message, data) {
        this.log({ message, data }, LogLevel.INFO);
    }
    warn(message, data) {
        this.log({ message, data }, LogLevel.WARN);
    }
}
exports.Logger = Logger;
exports.default = new Logger().getSingleton();
