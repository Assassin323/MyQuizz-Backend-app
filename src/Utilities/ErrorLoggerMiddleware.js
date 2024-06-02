// ErrorLoggerMiddleware.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDirectory = path.join(__dirname, '../../Logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}
const logFilePath = path.join(logsDirectory, 'ConsoleErrors.log');

// Create a writable stream to the log file
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Redirect console errors to the log file
console.error = (message) => {
  logStream.write(`${new Date().toISOString()} - CONSOLE ERROR: ${message}\n`);
};

// Create a Winston logger to log errors
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} - ${level}: ${message}\n${stack || ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilePath })
  ]
});

// Error logger middleware
const errorLoggerMiddleware = (err, req, res, next) => {
  console.error('<errorLoggerMiddleware>', err);
  logger.error({ message: 'Error occurred', error: err });
  next();
};

// Catch unhandled exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logger.error({ message: 'Uncaught Exception', error });
  process.exit(1);
});

module.exports = errorLoggerMiddleware;
