import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/User.js";
import logger from "../utils/logger.js";

export const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    req.user = null;
    return next();
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    req.user = null;
    return next();
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    req.user = null;
    return next();
  }

  logger.debug(`[Auth]: User ${user.username} authenticated`);
  req.user = {
    id: user._id,
    username: user.username,
    email: user.email,
  };
  return next();
};
