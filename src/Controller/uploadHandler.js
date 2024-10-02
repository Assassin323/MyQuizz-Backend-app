// uploadHandler.js
const express = require("express");
const multer = require("multer");
const { FileModel } = require("../Schema/Schema");
const { exec } = require("child_process");
const path = require("path");
const fs = require('fs').promises;
// const errorLogger = require("../Utilities/ErrorLoggerMiddleware");
// const consoleLogger = require("../Utilities/ConsoleLogger");
// const MediaModel = require("../Schema/UploadFileMediaSchema")

const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const handleUpload = async (req, res, next) => {
  try {
    console.info("File upload handler started");
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No File Uploaded",
      });
    }

    const newFileUpload = new FileModel({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer,
      path: req.file.originalname,
    });

    const TEMP_FILE_PATH = path.resolve(__dirname, '..', '..', 'public', 'temp_files');
    const MEDIA_BASE_PATH = path.resolve(__dirname, '..', '..', 'public', 'media');
    const PUBLIC_MEDIA_PATH = path.join(MEDIA_BASE_PATH, req.file.originalname.replace(".docx", ""));

    // Create necessary directories
    await fs.mkdir(PUBLIC_MEDIA_PATH, { recursive: true });
    await fs.mkdir(TEMP_FILE_PATH, { recursive: true });

    const htmlNewFileName = path.resolve(TEMP_FILE_PATH, `${newFileUpload.fileName.replace(".docx", "")}.html`);
    const tempFilePath = path.resolve(TEMP_FILE_PATH, req.file.originalname);

    // Write the uploaded file to a temporary location
    await fs.writeFile(tempFilePath, req.file.buffer);

    const pandocCommand = `pandoc "${tempFilePath}" --extract-media="${PUBLIC_MEDIA_PATH}" --mathml -o "${htmlNewFileName}"`;

    // Execute the Pandoc command to convert the file
    await new Promise((resolve, reject) => {
      exec(pandocCommand, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });

    // Read the converted HTML content
    let convertedFileContent = await fs.readFile(htmlNewFileName, 'utf-8');

    // Replace the image paths in the HTML content
    // convertedFileContent = convertedFileContent.replace(/src=".*?(media\/.*?)"/g, `src="/media/${req.file.originalname.replace('.docx', '')}/media/$1"`);
    convertedFileContent = convertedFileContent.replace(/src=".*?(media\/.*?)"/g, `src="/media/${req.file.originalname.replace('.docx', '')}/$1"`);


    // Save the converted HTML content to the database
    newFileUpload.convertedFileContent = convertedFileContent;
    await newFileUpload.save();

    // Optionally, clean up temporary files if they're no longer needed
    // Commenting this out if you still need temp files
    await fs.unlink(tempFilePath);
    await fs.unlink(htmlNewFileName);

    res.status(200).json({
      success: true,
      message: "File uploaded and converted successfully",
      fileId: newFileUpload._id,
      path: newFileUpload.path,
    });
  } catch (error) {
    console.error("File upload failed", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};


// const handleUpload = async (req, res, next) => {
//   try {
//     console.info("File upload handler started");
//     if (!req.file) {
//       console.warn("No file uploaded in request");
//       return res.status(400).json({
//         success: false,
//         message: "No File Uploaded",
//       });
//     }
//     // Log details about the uploaded file
//     console.info(`Received file: ${req.file.originalname}, type: ${req.file.mimetype}`);

//     const newFileUpload = new FileModel({
//       fileName: req.file.originalname,
//       fileType: req.file.mimetype,
//       fileData: req.file.buffer,
//       path: req.file.originalname,
//     });

//     const TEMP_FILE_PATH = path.resolve(__dirname, '..', '..', 'public', 'temp_files');
//     const MEDIA_BASE_PATH = path.resolve(__dirname, '..', '..', 'public', 'media');
//     const PUBLIC_MEDIA_PATH = path.join(__dirname, '..', '..', 'public', 'media', req.file.originalname.replace(".docx", ""));

//     await fs.mkdir(PUBLIC_MEDIA_PATH, { recursive: true });
//     await fs.mkdir(TEMP_FILE_PATH, {recursive: true});
//     const htmlNewFileName = path.resolve(TEMP_FILE_PATH, `${newFileUpload.fileName.replace(".docx", "")}.html`);
//     const tempFilePath = path.resolve(TEMP_FILE_PATH, req.file.originalname);

//     // Log the paths being used
//     console.info('Paths for file operations:');
//     console.info(`TEMP_FILE_PATH: ${TEMP_FILE_PATH}`);
//     console.info(`MEDIA_BASE_PATH: ${MEDIA_BASE_PATH}`);
//     console.info(`PUBLIC_MEDIA_PATH: ${PUBLIC_MEDIA_PATH}`);
//     console.info(`HTML output file: ${htmlNewFileName}`);
//     console.info(`Temp file location: ${tempFilePath}`);

//     // Write the uploaded file to a temporary location
//     await fs.writeFile(tempFilePath, req.file.buffer);
//     console.info(`File written to temp directory: ${tempFilePath}`);
//     const pandocCommand = `pandoc "${tempFilePath}" --extract-media="${PUBLIC_MEDIA_PATH}" --mathml -o "${htmlNewFileName}"`;
//     console.info(`Executing Pandoc command: ${pandocCommand}`);
//     await new Promise((resolve, reject) => {
//       exec(pandocCommand, (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Error during conversion: ${error.message}`);
//           reject(error);
//         } else if (stderr) {
//           console.error(`Pandoc stderr: ${stderr}`);
//           reject(new Error(stderr));
//         } else {
//           console.log(`Pandoc stdout: ${stdout}`);
//           resolve(stdout);
//         }
//       });
//     });

//     let convertedFileContent = await fs.readFile(htmlNewFileName, 'utf-8');
//     console.info(`HTML conversion completed. Content length: ${convertedFileContent.length}`);
//     // Generate the media path dynamically
//     // const relativeMediaPath = path.relative(MEDIA_BASE_PATH, PUBLIC_MEDIA_PATH).replace(/\\/g, '/');
//     // const serverMediaPath = `/media/${relativeMediaPath}`;
    
//     // Generate media path dynamically
//     const relativeMediaPath = path.relative(MEDIA_BASE_PATH, PUBLIC_MEDIA_PATH).replace(/\\/g, '/');
//     const serverMediaPath = `/media/${relativeMediaPath}`;
//     console.info(`Media paths generated: relativeMediaPath: ${relativeMediaPath}, serverMediaPath: ${serverMediaPath}`);

//     // Update image paths in the converted HTML
//     const mediaRegex = /src=".*?\/media\/(.*?)"/g;
//     convertedFileContent = convertedFileContent.replace(mediaRegex, `src="{PUBLIC_MEDIA_PATH}/media/$1"`);
//     console.info(`Updated file paths in converted HTML`);



//     // Save the converted HTML content to the database
//     newFileUpload.convertedFileContent = convertedFileContent;
//     await newFileUpload.save();
//     console.info(`File content saved to MongoDB with ID: ${newFileUpload._id}`);

//     await fs.unlink(tempFilePath);
//     await fs.unlink(htmlNewFileName);

//     res.status(200).json({
//       success: true,
//       message: "File uploaded and converted successfully",
//       fileId: newFileUpload._id,
//       path: newFileUpload.path,
//     });
//   } catch (error) {
//     // errorLogger.error("Error in handler", error);
//     console.error("File upload failed", error);
//     res.status(500).json({
//       message: "Internal server error.",
//     });
//   }
// };

module.exports = handleUpload;

