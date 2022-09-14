const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");
const { sendError } = require("../utils/helper");

exports.createUser = async (req, res) => {
  const body = req.body;
  const exists = await UserModel.findOne({ email: body.email });
  if (exists) return sendError(res, "This email already exists.");

  const user = new UserModel(body);

  await user.save().then((doc) => res.status(201).send(doc));
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim())
    return sendError(res, "Missing email/password.");

  const user = await UserModel.findOne({ email });
  if (!user) return sendError(res, "User not found.");

  const isMatched = await user.comparePasswords(password);
  if (!isMatched) return sendError(res, "Passwords do not match.");
};
