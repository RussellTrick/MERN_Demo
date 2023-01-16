const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Projects: {
    type: Array,
    required: true,
    default: [],
  },
  Role: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    const hash = await bcrypt.hash(this.Password, 10);
    this.Password = hash;
  }
  next();
});

UserSchema.methods.comparePasswords = async function (password) {
  const result = await bcrypt.compareSync(password, this.Password);
  return result;
};

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
