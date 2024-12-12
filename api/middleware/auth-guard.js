
export const authGuard = async (req, res, next) => {
  const session = req.session;
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return next();
};
