// uploadHandler.js
const express = require("express");
const multer = require("multer");
const { FileModel } = require("../Schema/Schema");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handleUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No File Uploaded",
      });
    }
    // Read HTML content from the uploaded file buffer
    const fileContent = req.file.buffer.toString("utf-8");

    const newFileUpload = new FileModel({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer,
      path: req.file.originalname, // Use the filename as the default path
      fileContent: fileContent,
    });
    // const uniqueId = Date.now().toString();
    const savedFiles = await newFileUpload.save();
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileId: savedFiles._id,
      path: savedFiles.path,
    });
  } catch (error) {
    console.error("File upload failed", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = handleUpload;
