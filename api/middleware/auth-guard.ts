import logger from "../utils/logger";

export const authGuard = async (req, res, next) => {
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
