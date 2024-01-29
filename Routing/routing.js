// routing.js
const express = require('express');
const router = express.Router();
const multer = require('multer');  // Import Multer here
const handleUpload = require('../Controller/uploadHandler');
const registerHandler = require('../Controller/RegisterHandler');
const loginHandler = require('../Controller/LoginHandler');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/uploadFile', upload.single('file'), handleUpload);
router.post('/register', registerHandler.registerUser);
router.post('/login', loginHandler.loginUser);

module.exports = router;
