const express = require('express');
const uploadHandler = require('./Controller/uploadHandler');
const path = require('path');
const router = require('./Routing/routing');

const app = express();
const port = 3002;

app.use('/', router);

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
