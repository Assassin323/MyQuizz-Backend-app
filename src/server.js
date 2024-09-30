const express = require('express');
const router = require('./Routing/routing');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ConsoleLoggerMiddleware } = require('./Utilities/ConsoleLogger');
const RequestLogger = require('./Utilities/RequestLoggerMiddleware');
require('dotenv').config({ path: './config.env' });
const path = require('path');

const app = express();
const port = process.env.PORT;

// Apply middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log incoming requests
app.use(RequestLogger);
// Serve static files from the 'public' directory
app.use('/media', express.static(path.join(__dirname, 'public', 'media')));

// Apply logging middleware
app.use(ConsoleLoggerMiddleware);
app.use('/', router);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
