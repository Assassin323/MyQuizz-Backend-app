const express = require('express');
const router = express.Router();
const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const app = express();


const IMAGE_PATH = path.join(__dirname, 'public', 'media');
const PUBLIC_IMAGE_PATH = '/images/media';
app.use(express.static(path.join(__dirname, 'assets', 'html-files')));
app.use(PUBLIC_IMAGE_PATH, express.static(IMAGE_PATH));

exports.processHTML = (htmlFilePath) => {
    try {
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
        const $ = cheerio.load(htmlContent);

        $('img').each((index, img) => {
            const originalSrc = img.attribs.src;
            img.attribs.src = `${PUBLIC_IMAGE_PATH}/${path.basename(originalSrc)}`;
            img.attribs.alt = 'Image not available';
        });
        

        // Add any other modifications to the HTML here
        $("head").append(
            '<script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"></script>'
        );
        $("img").addClass("image-class");

        if ($("table").length > 0) {
            $("table").attr(
                "style",
                "border: 1px solid black; margin: 1rem; width: 100%; border-collapse: collapse; font-size: 16px;"
            );
            $("td, th").css("border", "1px solid black");
        }

        return $.html();
    } catch (error) {
        throw new Error("Error reading HTML file: " + error);
    }
};

exports.upload = async (req, res) => {
    const htmlFilePath = path.join(__dirname, 'assets', 'html-files', 'QP1.html');
    try {
        const processedHTML = exports.processHTML(htmlFilePath);
        res.send(processedHTML);
    } catch (error) {
        res.send(error.message);
    }
};