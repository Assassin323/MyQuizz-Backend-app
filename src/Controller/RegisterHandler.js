const { UserModel } = require("../Schema/Schema");
const colors = require("colors");

exports.registerUser = async (req, res) => {
  try {
    const { username, password, phoneNumber, email } = req.body;

    if (!username || !password || phoneNumber === undefined || !email) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const existingUser = await UserModel.findOne({ username }).maxTime(3000);

    if (existingUser) {
      return res.status(400).json({
        message: "User already existed.",
      });
    }

    const newUser = new UserModel({
      username,
      password,
      phoneNumber,
      email,
    });

    await newUser.save();

    return res.status(201).json({
      message: `User ${username} registered successfully`,
    });
  } catch (err) {
    console.error("<RegisterHandler Error>", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
