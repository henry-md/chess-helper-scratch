export const authGuard = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No valid token",
    });
  }

  return next();
};
