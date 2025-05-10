import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from 'express';

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    req.user = undefined;
    return next();
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    req.user = undefined;
    return next();
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    req.user = undefined;
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
