import logger from "../utils/logger";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Schema } from "joi";

// Custom middleware to throw error in specific format w/ message, error, success.
export const validate = (schema: Schema, property = "body") => {
  return ((req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property as keyof Request], { abortEarly: false });

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
  }) as RequestHandler;
};
