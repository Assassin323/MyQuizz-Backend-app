const { FileModel } = require("../Schema/Schema");
const { ConsoleLogger } = require('../Utilities/ConsoleLogger');

const getAllFiles = async (req, res, next) => {
  try {
    const files = await FileModel.find({}, { fileName: 1, fileType: 1, uploadDate: 1, path: 1 });
    return res.status(200).json(files);
  } catch (error) {
    // Log the error with details
    ConsoleLogger.error(`Error fetching files: ${error.message}`);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getFileDetails = async (req, res) => {
  try {
    const file = await FileModel.findOne({ fileName: req.params.filename });
    if (!file) {
      ConsoleLogger.info(`File not found: ${req.params.filename}`);
      return res.status(404).json({ message: "File not found" });
    }
    ConsoleLogger.info(`Successfully fetched details for file: ${req.params.filename}`);
    return res.status(200).json(file);
  } catch (error) {
    ConsoleLogger.error(`Error fetching file details: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllFiles, getFileDetails };
