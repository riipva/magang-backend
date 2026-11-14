const AppError = require("../utils/AppError");

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("Anda tidak memiliki izin untuk melakukan tindakan ini.", 403)
      );
    }

    next();
  };
};

module.exports = restrictTo;