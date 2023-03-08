const router = require("express").Router();
const { protectRoute } = require("./middleware/auth");

const { validateUser, validate } = require("../middlewares/validator");
const { register, login, getUsers } = require("../controllers/Users");

router.post("/signup", validateUser, validate, register);
router.post("/signin", login);
router.get("/getusers", protectRoute, getUsers);

router.get("/protected-route", protectRoute, (req, res) => {
  res.json({ message: "This is a protected route." });
});

module.exports = router;
