import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check if Authorization header exists and is Bearer type
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // ✅ Find user in database
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token" });
  }
};

export default verifyUser;
