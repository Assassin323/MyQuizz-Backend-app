const fs = require('fs');
const cheerio = require('cheerio');
const express = require('express');
const path = require('path');

const app = express();
const port = 3002;

const IMAGE_PATH = path.join(__dirname, 'public', 'media');
const PUBLIC_IMAGE_PATH = '/images/media';

// Serve both HTML file and images
app.use(express.static(path.join(__dirname, 'assets', 'html-files')));
app.use(PUBLIC_IMAGE_PATH, express.static(IMAGE_PATH));

app.get('/', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'assets', 'html-files', 'QP1.html');

    try {
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
        const $ = cheerio.load(htmlContent);

        $('img').each((index, img) => {
            const originalSrc = img.attribs.src;
            // console.log('Original Image Path:', originalSrc);
        
            // Resolve the relative path using path.relative
            const relativePath = path.relative(IMAGE_PATH, originalSrc);
        
            // Set the image path to the full public URL
            img.attribs.src = `${PUBLIC_IMAGE_PATH}/${relativePath}`;
            img.attribs.alt = 'Image not available';
        });
        
        
        

        $('head').append('<script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"></script>');

        $('img').addClass('image-class');

        if ($('table').length > 0) {
            $('table').attr('style', 'border: 1px solid black; margin: 1rem; width: 100%; border-collapse: collapse; font-size: 16px;');
            $('td, th').css('border', '1px solid black');
        }

        const processedHTML = $.html();
        res.send(processedHTML);
    } catch (error) {
        res.send('Error reading HTML file: ' + error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
