import fs from 'fs';
import path from 'path';
import winston from 'winston';

// Diretório de logs
const logDir = path.resolve(path.dirname(__filename), '../../log');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, `${new Date().toISOString().slice(0, 10)}.log`);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new winston.transports.File({ filename: logFile }),
        new winston.transports.Console()
    ]
});

export default logger;
