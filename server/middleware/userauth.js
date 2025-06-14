import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode && tokenDecode.id) {
      req.userId = tokenDecode.id; // Keep variable name as requested
      next();
    } else {
      return res.status(401).json({ success: false, message: "Token verification failed." });
    }
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default userAuth;
