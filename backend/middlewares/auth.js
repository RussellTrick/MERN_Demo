const jwt = require("jsonwebtoken");

// Middleware to protect routes
const protectRoute = async (req, res, next) => {
  try {
    // Get the token from the Authorization header or HTTP cookie
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Verify the token
    if (!token) {
      throw new Error("Token not found");
    }
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
