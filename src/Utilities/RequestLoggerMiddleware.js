const fs = require("fs");
const { promisify } = require("util");
const appendFile = promisify(fs.appendFile);
const path = require("path");

async function RequestLogger(req, res, next) {
  try {
    const logsDirectory = "./Logs";
    const logFilePath = path.join(logsDirectory, "ApiLoggingLogs.log");
    // Ensure the 'Logs' directory exists
    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory);
    }
    logMessage = `${new Date()} - ${req.method} - ${req.url} - ${req.body} \n`;
    await appendFile(logFilePath, logMessage);
    next();
  } catch (err) {
    next(err);
  }
}
module.exports = RequestLogger;
