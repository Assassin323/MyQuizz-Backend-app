// FileMiddleware.js
const path = require("path");
const { exec } = require("child_process");
const express = require("express");
const { loggers } = require("winston");

const PUBLIC_MEDIA_PATH = path.join(__dirname, "../../public/media");
console.info("PUBLIC_MEDIA_PATH -> ", PUBLIC_MEDIA_PATH)
const convertDocxToHtml = async (docxBuffer) => {
  try {
    // Construct the Pandoc command
    // const pandocCommand = `pandoc --mathml --extract-media="${PUBLIC_MEDIA_PATH}" -t html`;
    const pandocCommand = `pandoc  --extract-media="${PUBLIC_MEDIA_PATH}"  --mathml -o html`;

    console.log("docxBuffer: ", docxBuffer);
    loggers.info("docxBuffer: ", docxBuffer)
    // Execute the Pandoc command using child_process, and provide docxBuffer as input
    const { stdout, stderr } = await exec(pandocCommand, { input: docxBuffer });

    console.error("Pandoc stdout:", stdout);
    console.error("Pandoc stderr:", stderr);

    if (stderr) {
      // Improved error handling based on stderr content (replace with your logic)
      if (stderr.includes("Missing required argument")) {
        throw new Error("A required argument for Pandoc is missing.");
      } else {
        throw new Error("Conversion failed: " + stderr);
      }
    }

    return stdout; // Return the HTML content
  } catch (error) {
    console.error("Conversion failed:", error);
    loggers.err("Conversion failed:", error)
    throw new Error("Conversion failed");
  }
};

module.exports = convertDocxToHtml;
