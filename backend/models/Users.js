const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  Password: {
    type: String,
    required: true,
  },
  Projects: {
    type: Array,
    default: [],
  },
  Role: {
    type: String,
    default: "developer",
  },
  Hashtag: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema, "Member");
