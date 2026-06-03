import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
  if (!authHeader) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid token",
    });
  }
};

export default auth;
