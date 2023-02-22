const router = require("express").Router();
const { protectRoute } = require("./middleware/auth");

const { validateUser, validate } = require("../middlewares/validator");
const { createUser, signIn, getUsers } = require("../controllers/Users");

router.post("/signup", validateUser, validate, createUser);
router.post("/signin", signIn);
router.get("/getusers", getUsers);

router.get("/protected-route", protectRoute, (req, res) => {
  res.json({ message: "This is a protected route." });
});

module.exports = router;
