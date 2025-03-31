import logger from "../utils/logger.js";

// Custom middleware to throw error in specific format w/ message, error, success.
export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (!error) {
      return next();
    }

    const errors = error.details.map((detail) => detail.message);
    logger.error(`Validation error: ${errors.join(", ")}`);

    return res.status(400).json({
      message: "Validation error",
      errors,
      success: false,
    });
  };
};
