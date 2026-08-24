import passport from "passport";

export const authenticate = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      (error, user, info) => {
        if (error) {
          return next(error);
        }

        if (!user) {
          return res.status(info?.statusCode || 401).json({
            status: "error",
            message: info?.message || "No autenticado"
          });
        }

        req.user = user;

        next();
      }
    )(req, res, next);
  };
};