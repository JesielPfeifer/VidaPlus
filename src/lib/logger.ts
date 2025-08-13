import fs from 'fs';
import path from 'path';
import winston from 'winston';

class Logger {
    private logDir: string;
    private logFile: string;
    private logger: winston.Logger;

    constructor() {
        this.logDir = path.resolve(path.dirname(__filename), '../../log');
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }

        const date = new Date();
        date.setHours(date.getHours() - 3);
        this.logFile = path.join(
            this.logDir,
            `${date.toISOString().slice(0, 10)}.log`,
        );

        const gmt3Timestamp = () => {
            const d = new Date();
            d.setHours(d.getHours() - 3);
            return d.toISOString().replace('T', ' ').slice(0, 19);
        };

        const transports: winston.transport[] = [
            new winston.transports.File({ filename: this.logFile }),
        ];

        if (process.env.NODE_ENV !== 'production') {
            transports.push(new winston.transports.Console());
        }

        this.logger = winston.createLogger({
            level: 'silly',
            format: winston.format.combine(
                winston.format.timestamp({ format: gmt3Timestamp }),
                winston.format.printf(
                    ({ timestamp, level, message }) =>
                        `${timestamp} [${level}]: ${message}`,
                ),
            ),
            transports,
        });
    }

    public log(level: string, message: string) {
        this.logger.log(level, message);
    }

    public info(message: string) {
        this.logger.info(message);
    }

    public error(message: string) {
        this.logger.error(message);
    }

    public warn(message: string) {
        this.logger.warn(message);
    }

    public debug(message: string) {
        this.logger.debug(message);
    }
}

const logger = new Logger();
export default logger;
