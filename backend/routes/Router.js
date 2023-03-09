const router = require("express").Router();
const { protectRoute } = require("../middlewares/auth");

const { validateUser, validate } = require("../middlewares/validator");
const { register, login, getUsers } = require("../controllers/Users");

router.post("/register", register);
router.post("/login", login);
router.get("/getusers", protectRoute, getUsers);

router.get("/protected-route", protectRoute, (req, res) => {
  res.json({ message: "This is a protected route." });
});

module.exports = router;
