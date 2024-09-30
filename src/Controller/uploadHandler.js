// uploadHandler.js
const express = require("express");
const multer = require("multer");
const { FileModel } = require("../Schema/Schema");
const { exec } = require("child_process");
const path = require("path");
const fs = require('fs').promises;
const logger = require("../Utilities/ConsoleLogger");
const MediaModel = require("../Schema/UploadFileMediaSchema")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const handleUpload = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No File Uploaded",
//       });
//     }

//     const newFileUpload = new FileModel({
//       fileName: req.file.originalname,
//       fileType: req.file.mimetype,
//       fileData: req.file.buffer,
//       path: req.file.originalname,
//     });

//     const TEMP_FILE_PATH = path.resolve(__dirname, '..', '..', 'public', 'temp_files');
//     const PUBLIC_MEDIA_PATH = path.join(__dirname, '..', '..', 'public', 'media', req.file.originalname.replace(".docx", ""),'media');
//     await fs.mkdir(PUBLIC_MEDIA_PATH, { recursive: true });
//     const htmlNewFileName = path.resolve(TEMP_FILE_PATH, `${newFileUpload.fileName.replace(".docx", "")}.html`);
//     const tempFilePath = path.resolve(TEMP_FILE_PATH, req.file.originalname);

//     // Write the uploaded file to a temporary location
//     await fs.writeFile(tempFilePath, req.file.buffer);

//     const pandocCommand = `pandoc "${tempFilePath}" --extract-media="${PUBLIC_MEDIA_PATH}" --mathml -o "${htmlNewFileName}"`;

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

//     // Replace the absolute media paths with relative ones
//     const serverMediaPath = `/media/${req.file.originalname.replace(".docx", "")}/media`;
//     convertedFileContent = convertedFileContent.replace(new RegExp(`file://${PUBLIC_MEDIA_PATH.replace(/\\/g, '/')}`, 'g'), serverMediaPath);

//     newFileUpload.convertedFileContent = convertedFileContent;

//     await newFileUpload.save();

//     await fs.unlink(tempFilePath);
//     await fs.unlink(htmlNewFileName);

//     res.status(200).json({
//       success: true,
//       message: "File uploaded and converted successfully",
//       fileId: newFileUpload._id,
//       path: newFileUpload.path,
//     });
//   } catch (error) {
//     logger.error("Error in handler", error);
//     console.error("File upload failed", error);
//     res.status(500).json({
//       message: "Internal server error.",
//     });
//   }
// };

// v2 had proper path but still media not visible
const handleUpload = async (req, res, next) => {
  try {
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
    const PUBLIC_MEDIA_PATH = path.join(__dirname, '..', '..', 'public', 'media', req.file.originalname.replace(".docx", ""));
    await fs.mkdir(PUBLIC_MEDIA_PATH, { recursive: true });

    const htmlNewFileName = path.resolve(TEMP_FILE_PATH, `${newFileUpload.fileName.replace(".docx", "")}.html`);
    const tempFilePath = path.resolve(TEMP_FILE_PATH, req.file.originalname);

    // Write the uploaded file to a temporary location
    await fs.writeFile(tempFilePath, req.file.buffer);

    const pandocCommand = `pandoc "${tempFilePath}" --extract-media="${PUBLIC_MEDIA_PATH}" --mathml -o "${htmlNewFileName}"`;

    await new Promise((resolve, reject) => {
      exec(pandocCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error during conversion: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`Pandoc stderr: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`Pandoc stdout: ${stdout}`);
          resolve(stdout);
        }
      });
    });

    let convertedFileContent = await fs.readFile(htmlNewFileName, 'utf-8');

    // Generate the media path dynamically
    const relativeMediaPath = path.relative(MEDIA_BASE_PATH, PUBLIC_MEDIA_PATH).replace(/\\/g, '/');
    const serverMediaPath = `/media/${relativeMediaPath}`;
    console.log("relativeMediaPath: " + relativeMediaPath);
    console.log("serverMediaPath: " + serverMediaPath);
    // Replace absolute media paths with relative ones
    convertedFileContent = convertedFileContent.replace(/file:\/\/\/.*?\/media\//g, serverMediaPath + '/');

    newFileUpload.convertedFileContent = convertedFileContent;

    await newFileUpload.save();

    await fs.unlink(tempFilePath);
    await fs.unlink(htmlNewFileName);

    res.status(200).json({
      success: true,
      message: "File uploaded and converted successfully",
      fileId: newFileUpload._id,
      path: newFileUpload.path,
    });
  } catch (error) {
    logger.error("Error in handler", error);
    console.error("File upload failed", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};


// v3 has media stored in db

// const handleUpload = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No File Uploaded",
//       });
//     }

//     // Create a new file entry in FileModel
//     const newFileUpload = new FileModel({
//       fileName: req.file.originalname,
//       fileType: req.file.mimetype,
//       fileData: req.file.buffer,
//       path: req.file.originalname,
//     });

//     // Prepare paths for temporary files
//     const TEMP_FILE_PATH = path.resolve(__dirname, '..', '..', 'public', 'temp_files');
//     const htmlNewFileName = path.resolve(TEMP_FILE_PATH, `${newFileUpload.fileName.replace(".docx", "")}.html`);
//     const tempFilePath = path.resolve(TEMP_FILE_PATH, req.file.originalname);

//     // Write the uploaded file to a temporary location
//     await fs.writeFile(tempFilePath, req.file.buffer);

//     // Run pandoc command to extract media
//     const pandocCommand = `pandoc "${tempFilePath}" --extract-media="./media" --mathml -o "${htmlNewFileName}"`;

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

//     // Read the converted HTML file
//     let convertedFileContent = await fs.readFile(htmlNewFileName, 'utf-8');

//     // Extract images from the converted media and save them in the new UploadFileMedia schema
//     const mediaEntry = new MediaModel({
//       fileName: newFileUpload.fileName,
//       images: [],
//     });

//     // Assuming the images are stored in the media folder created by pandoc
//     const mediaFiles = await fs.promises.readdir(path.join(__dirname, '..', '..', 'public', 'media'));

//     for (const mediaFile of mediaFiles) {
//       // Read image data
//       const imageBuffer = await fs.promises.readFile(path.join(__dirname, '..', '..', 'public', 'media', mediaFile));
      
//       // Add image to the media entry
//       mediaEntry.images.push({
//         imageName: mediaFile,
//         imageData: imageBuffer,
//       });
//     }

//     // Save media entry to database
//     await mediaEntry.save();

//     // Replace absolute media paths with relative ones in converted file content
//     const relativeMediaPath = mediaEntry.images.map(img => img.imageName).join(', ');
//     convertedFileContent = convertedFileContent.replace(/file:\/\/\/.*?\/media\//g, relativeMediaPath);

//     // Save the converted file content in the file model
//     newFileUpload.convertedFileContent = convertedFileContent;
//     await newFileUpload.save();

//     // Clean up temporary files
//     await fs.unlink(tempFilePath);
//     await fs.unlink(htmlNewFileName);

//     res.status(200).json({
//       success: true,
//       message: "File uploaded and converted successfully",
//       fileId: newFileUpload._id,
//       path: newFileUpload.path,
//     });
//   } catch (error) {
//     console.error("Error in handler", error);
//     res.status(500).json({
//       message: "Internal server error.",
//     });
//   }
// };


module.exports = handleUpload;

