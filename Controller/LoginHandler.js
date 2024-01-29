// LoginHandler.js
const { UserModel } = require("../Schema/Schema");
const colors = require("colors");

exports.loginUser = async (req, res) => {
  try { 
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    const user = await UserModel.findOne({ username, password }).maxTime(3000);

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    return res.status(200).json({

      message: `User ${username} logged in successfully`,
    });
  } catch (err) {
    console.error("<LoginHandler Error>", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
