const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDirectory = path.join(__dirname, '../../Logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}
const logFilePath = path.join(logsDirectory, 'InfoLogs.log');

// Create a writable stream to the log file
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Redirect console info and warn to the log file
console.info = (message) => {
  logStream.write(`${new Date().toISOString()} - CONSOLE INFO: ${message}\n`);
};

console.warn = (message) => {
  logStream.write(`${new Date().toISOString()} - CONSOLE WARN: ${message}\n`);
};

// Create a Winston logger to log info and warn levels
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

// Info level logger middleware
const infoLoggerMiddleware = (req, res, next) => {
  // Intercept and log info level messages
  const originalInfo = console.info;
  console.info = (message) => {
    logger.info({ message });
    originalInfo(message);
  };

  // Intercept and log warn level messages
  const originalWarn = console.warn;
  console.warn = (message) => {
    logger.warn({ message });
    originalWarn(message);
  };

  next();
};

module.exports = infoLoggerMiddleware;
