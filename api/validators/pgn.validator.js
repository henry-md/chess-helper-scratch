import Joi from "joi";

export const createPgnSchema = Joi.object({
  title: Joi.string().required().trim().min(1).max(100),
  pgn: Joi.string().required().trim(),
  notes: Joi.string().allow("").trim().default(""),
  isPublic: Joi.boolean().default(false),
});

export const updatePgnSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).optional(),
  pgn: Joi.string().trim().optional(),
  notes: Joi.string().allow("").trim().optional(),
  isPublic: Joi.boolean().optional(),
}).min(1); // Require at least one field to be present

export const pgnIdSchema = Joi.object({
  id: Joi.string().required().hex().length(24), // MongoDB ObjectId validation
});
