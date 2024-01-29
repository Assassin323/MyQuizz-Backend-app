const mongoose = require("mongoose");
const DB_URI =
  "mongodb+srv://talhakothiwale:SomeSecurePass2024@t-cluster0.tslsnfq.mongodb.net/MyQuizz-app";
const colors = require("colors");

mongoose.connect(DB_URI, {}).then(() => console.log("Connected to DB".green));

const UserSchema = new mongoose.Schema(
  {
    userID: {
      type: Number,
      unique: true,
      index: true,
      default: () => Math.floor(Math.random() * 1000),
    },
    username: {
      type: String,
      required: [true, "Username is a required field"],
    },
    password: {
      type: String,
      required: [true, "Password is a required field"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Phone number is a required field"],
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("UsersLogin", UserSchema);

// File schema and model
const fileSchema = mongoose.Schema(
  {
    fileName: String,
    fileType: String,
    uploadDate: { type: Date, default: Date.now },
    fileData: Buffer,
  },
  {
    timestamps: true,
  }
);

const FileModel = mongoose.model("FileUploadCollection", fileSchema);
module.exports = { UserModel, mongoose, FileModel };
