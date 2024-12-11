
export const authGuard = async (req, res, next) => {
  console.log('in auth guard: session', req.session, 'userId', req.userId);
  const session = req.session;
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return next();
};
