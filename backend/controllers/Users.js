const UserModel = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

exports.register = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = new UserModel({ Email, Password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
    const user = await UserModel.findOne({ Email });

    if (!user) {
      return res.status(401).json(console.log("401 Not Found"));
    }
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json(console.log("401 Invalid Password"));
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log(token);

    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
    });

    res.json({
      success: true,
      user: {
        name: user.FirstName,
        id: user._id,
        email: user.Email,
        projects: user.Projects,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.json({ message: "User logged out successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.addProjectToUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const projectId = req.body.projectId;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { Projects: projectId } },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
};
