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
        firstName: user.FirstName,
        lastName: user.LastName,
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
    const users = await UserModel.find(
      {},
      { Email: 1, FirstName: 1, LastName: 1, _id: 1 }
    );
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.addProjectToUser = async (req, res, next) => {
  try {
    let userId = req.user._id;
    const projectId = req.body.projectId;

    if (req.body.userId) {
      userId = req.body.userId;
    }

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

exports.removeProjectFromUser = async (req, res, next) => {
  console.log("Attempting to remove project from user");
  try {
    let userId = req.user._id;
    const projectId = req.body.projectId;
    if (req.body.userId) {
      userId = req.body.userId;
    }

    console.log(userId);
    console.log(projectId);
    console.log(req.body.userId);

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { Projects: projectId } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      success: true,
      user: {
        _id: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        Projects: user.Projects,
      },
    });
  } catch (err) {
    next(err);
  }
};
