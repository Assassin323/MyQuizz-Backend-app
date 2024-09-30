const fs = require('fs');
const winston = require('winston');
const path = require('path');

// Specify the log directory path
const logDirectory = path.join(__dirname, '../../Logs');

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Define the path for the API logging file
const apiLogFile = path.join(logDirectory, 'ApiLoggingLogs.log');

// Custom format function to produce the required log format
const customFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${new Date(timestamp).toString()} - ${message}`;
});

// Set up the Winston logger with file transport
const apiLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.File({ filename: apiLogFile, level: 'info' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Middleware function to log requests
function RequestLogger(req, res, next) {
    // Format the log message
    const logMessage = `${req.method} - ${req.url} - ${JSON.stringify(req.body)}`;
    apiLogger.info(logMessage);
    next();
}

module.exports = RequestLogger;
