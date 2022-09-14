const router = require("express").Router();

const { check } = require("express-validator");
const { validateUser, validate } = require("../middlewares/validator");
const { createUser, signIn, getUsers } = require("../controllers/Users");

router.post("/signup", validateUser, validate, createUser);
router.post("/signin", signIn);
router.get("/getusers", getUsers);

module.exports = router;
