import { verifyToken } from "../utils/jwt";
import { IUserDocument, User } from "../models/User";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from 'express';
import { serializeUser } from "../../web/src/lib/serializers";
import { StoredUser } from "../../web/src/lib/types";

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

  const user: IUserDocument | null = await User.findById(decoded.userId);
  if (!user) {
    req.user = undefined;
    return next();
  }

  logger.debug(`[Auth]: User ${user.username} authenticated`);
  const serializedUser: StoredUser = serializeUser(user);
  req.user = serializedUser;
  return next();
};
