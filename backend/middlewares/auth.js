const jwt = require("jsonwebtoken");

// Middleware to protect routes
const protectRoute = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Add the user to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { protectRoute };
