const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
    } catch (err) {
      return next(err);
    }
  }
  return next();
});

userSchema.methods.comparePasswords = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.index({ email: 1, lastName: 1 }, { unique: true });

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
