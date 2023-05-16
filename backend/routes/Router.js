const router = require("express").Router();
const { checkAuth } = require("../middlewares/auth");

const {
  register,
  login,
  getUsers,
  logout,
  getUserById,
  addProjectToUser,
} = require("../controllers/Users");

router.post("/register", register);
router.post("/login", login);
router.get("/getusers", checkAuth, getUsers);
router.post("/logout", logout);
router.get("/:id", checkAuth, getUserById);
router.post("/", checkAuth, addProjectToUser);

router.get("/check-auth", checkAuth, async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.status(200).json({ authenticated: true });
});

router.get("/protected-route", checkAuth, (req, res) => {
  res.json({ message: "This is a protected route." });
});

module.exports = router;
