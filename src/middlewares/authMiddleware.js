import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.cookies?.token;

    if (!authHeader)
      return res.status(401).json({ message: "Access denied. No token provided." });

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid or expired token" });

      req.user = decoded; // store user info in request
      next();
    });
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: invalid role" });
    }
    next();
  };
};

