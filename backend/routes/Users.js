const router = require("express").Router();

const { check } = require("express-validator");
const { validateUser, validate } = require("../middlewares/validator");
const { createUser } = require("../controllers/Users");

router.post("/signup", validateUser, validate, createUser);

module.exports = router;
