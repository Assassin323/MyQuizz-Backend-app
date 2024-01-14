const express = require('express');
const router = express.Router();
const {upload } = require('../Controller/uploadHandler')
router.post('/upload', upload);
module.exports = router;