// ViewFileHandler.js
const { FileModel } = require("../Schema/Schema");


const getAllFiles = async (req, res, next) => {
    try {
      const files = await FileModel.find({}, { fileName: 1, fileType: 1, uploadDate: 1, path: 1 });
      return res.status(200).json(files);
    } catch (error) {
      console.error("Error fetching files", error);
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  };
  
  const getFileDetails = async (req, res, next) => {
    try {
      const file = await FileModel.findOne({ fileName: req.params.filename });
      if (!file) {
        return res.status(404).json({
          message: "File not found",
        });
      }
      return res.status(200).json(file);
    } catch (error) {
      console.error("Error fetching file details", error);
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  };

  module.exports = {getAllFiles, getFileDetails}