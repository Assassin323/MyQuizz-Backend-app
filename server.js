// server.js
const express = require('express');
const uploadHandler = require('./Controller/uploadHandler');
const path = require('path');
const router = require('./Routing/routing');
const cors = require('cors');
const colors = require("colors");
const bodyParser = require('body-parser');
const RequestLoggerMiddleware = require('./Utilities/RequestLoggerMiddleware');
const errorLoggerMiddleware = require('./Utilities/ErrorLoggerMiddleware');

const app = express();
const port = 3002;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Loggers
app.use(errorLoggerMiddleware);
app.use(RequestLoggerMiddleware);
app.use('/', router);

/*
// Serve static files from the 'public/media' directory
app.use('/images/media', express.static(path.join(__dirname, 'public', 'media')));
app.get('/', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'assets', 'html-files', 'QP2.html');
    try {
        const processedHTML = uploadHandler.processHTML(htmlFilePath);
        res.send(processedHTML);
    } catch (error) {
        res.send(error.message);
    }
});
*/
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`.yellow);
});
