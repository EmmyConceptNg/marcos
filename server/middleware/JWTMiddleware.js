import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to verify JWT using Bearer Token and attach user to req.user
export const authenticateToken = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1] 
      : null;

  if (!token) {
    return res.status(403).json({ error: "Access denied, no token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    // Attach the user to the request object
    req.user = await User.findById(decoded.id).select("-password"); // Exclude password

    if (!req.user) {
      return res.status(404).json({ error: "User not found." });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: "Invalid token or token expired." });
  }
};
