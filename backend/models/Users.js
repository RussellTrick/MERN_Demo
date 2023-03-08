const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    field: "Email",
  },
  firstName: {
    type: String,
    required: true,
    field: "FirstName",
  },
  lastName: {
    type: String,
    required: true,
    field: "LastName",
  },
  password: {
    type: String,
    required: true,
    field: "Password",
  },
  projects: {
    type: Array,
    field: "Projects",
    default: [],
  },
  role: {
    type: String,
    required: true,
    field: "Role",
  },
});

module.exports = mongoose.model("users", userSchema);
