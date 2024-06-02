// routing.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const handleUpload = require('../Controller/uploadHandler');
const registerHandler = require('../Controller/RegisterHandler');
const loginHandler = require('../Controller/LoginHandler');
const {getAllFiles, getFileDetails} = require('../Controller/ViewFileHandler');
const { removeFile } = require('../Controller/DeleteFileHandler');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/uploadFile', upload.single('file'), handleUpload);
router.post('/register', registerHandler.registerUser);
router.post('/login', loginHandler.loginUser);
router.get("/files", getAllFiles);
router.get("/files/:filename", getFileDetails);
router.delete('/files/:filename', removeFile);

module.exports = router;