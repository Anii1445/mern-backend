const parseVariantMiddleware = (req, res, next) => {
  if (req.body.variant && typeof req.body.variant === "string") {
    try {
      req.body.variant = JSON.parse(req.body.variant);
    } catch (err) {
      return res.status(400).json({
        message: "Invalid variant format",
      });
    }
  }
  next();
};


module.exports = parseVariantMiddleware;   