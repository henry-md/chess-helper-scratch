import logger from "../utils/logger";
import { Request, Response, NextFunction } from 'express';


export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    logger.error(`[AuthGuard]: Unauthorized - No valid token`);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No valid token",
    });
  }

  logger.debug(`[AuthGuard]: User ${req.user.username} authenticated`);
  return next();
};
