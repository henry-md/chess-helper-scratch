import { verifyToken } from "../utils/jwt";
import { IUser, User } from "../models/User";
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

  const user: IUser | null = await User.findById(decoded.userId);
  if (!user) {
    req.user = undefined;
    return next();
  }

  logger.debug(`[Auth]: User ${user.username} authenticated`);
  req.user = user.toObject() as IUser;
  return next();
};
