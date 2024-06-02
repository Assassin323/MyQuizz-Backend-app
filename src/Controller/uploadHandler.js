// uploadHandler.js
const multer = require("multer");
// const { FileModel } = require("../Schema/Schema");
const {UploadService} = require("../Service/UploadService")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handleUpload = async (req, res, next) => {
  const  {file}  = req; 
  console.log("File from uploadHandler>>" + req);
  try {
    let result = await UploadService(file);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        fileId: result._id,
        path: result.path,
      });
    }
    next();

  } catch (error) {
    console.error("File upload failed", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = handleUpload;
