// UploadService.js
const { FileModel } = require("../Schema/Schema");
const convertDocxToHtml = require('../Utilities/FileMiddleware');

exports.UploadService = async (file) => {
  try {
    if (!file) {
      console.error("File Not Found error", file);
      throw new Error("File Not Found error");
    }

    const htmlBuffer = await convertDocxToHtml(file.buffer, file.originalname);
    console.info("Original Filename: ", originalname);
    console.info("file.buffer : ", file.buffer);
    console.info("htmlBuffer: ", htmlBuffer);

    if (!htmlBuffer || htmlBuffer.length === 0) {
      console.error("Conversion of file resulted in empty html content");
      throw new Error("Conversion of file resulted in empty html content");
    }

    const savedFile = await FileModel.create({
      fileName: file.originalname,
      fileType: file.mimetype,
      fileData: htmlBuffer,
      path: `${file.originalname}.html`, // Update the path with the HTML extension
      fileContent: htmlBuffer.toString(), // Store the HTML content
    });

    return savedFile;
  } catch (err) {
    console.error("File upload failed");
    
    throw new Error("Internal server error");
  }
};
