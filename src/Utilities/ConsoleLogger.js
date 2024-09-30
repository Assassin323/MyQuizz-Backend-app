const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Specify the log directory path
const logDirectory = path.join(__dirname, '../../Logs');

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Define the paths for the log files
const errorLogFile = path.join(logDirectory, 'Error_Logs.log');
const infoLogFile = path.join(logDirectory, 'Info_Logs.log');

// Custom format function to produce the required log format
const customFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${new Date(timestamp).toString()} - ${level.toUpperCase()} - ${message}`;
});

// Create a single Winston logger instance
const ConsoleLogger = winston.createLogger({
    level: 'info', // Default level for console logging
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.File({
            filename: errorLogFile,
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                customFormat
            )
        }),
        new winston.transports.File({
            filename: infoLogFile,
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                customFormat
            )
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        })
    ]
});

const ConsoleLoggerMiddleware = (req, res, next) => {
    ConsoleLogger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
};

module.exports = {
    ConsoleLogger,
    ConsoleLoggerMiddleware
};
