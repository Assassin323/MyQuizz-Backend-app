const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const DB_URI = process.env.DATABASE_URI;
mongoose.connect(DB_URI, {}).then(() => console.log("Connected to DB".green));

const mediaSchema = new mongoose.Schema(
    {
      fileName: {
        type: String,
        required: true,
      },
      images: [
        {
          imageName: {
            type: String,
            required: true,
          },
          imageData: Buffer, // Store image data as Buffer
        },
      ],
    },
    {
      timestamps: true,
    }
  );
  
  const MediaModel = mongoose.model("FileMedia", mediaSchema);
  module.exports = MediaModel;