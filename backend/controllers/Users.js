const UserModel = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log({ email }, { password });
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true, secure: true });

    res.json({
      success: true,
      user: {
        name: user.firstName,
        id: user._id,
        email: user.email,
        projects: user.projects,
      },
    });
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
