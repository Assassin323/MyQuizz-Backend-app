const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '../Logs');
const logFilePath = path.join(logsDirectory, 'ErrorLogs.log');

const errorLoggerMiddleware = (err, req, res, next) => {
    console.error("<errorLoggerMiddleware>", err);
    const logMessage = `${new Date().toISOString()} - ${err.stack}\n`;
    fs.appendFile(logFilePath, logMessage, (fileErr) => {
        if (fileErr) {
            console.error('Error writing to error log:', fileErr);
        }
    });

    next();
};

// Catch unhandled exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // You can also log this error to the same file or another log file
    fs.appendFile(logFilePath, `${new Date().toISOString()} - Uncaught Exception: ${error.stack}\n`, (fileErr) => {
        if (fileErr) {
            console.error('Error writing to error log:', fileErr);
        }
    });

    // Ensure the process exits
    process.exit(1);
});

module.exports = errorLoggerMiddleware;
