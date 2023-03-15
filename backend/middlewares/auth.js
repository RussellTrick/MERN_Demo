const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  console.log("checkAuth middleware called!");
  const token = req.cookies.token;
  if (!token) {
    console.log("Token missing from cookie!");
    return res.status(401).json({ message: "Token missing from cookie" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Error decoding token:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { checkAuth };
