import { User } from "../models/User.js";
import { Pgn } from "../models/Pgn.js";
import { authGuard } from "../middleware/auth-guard.js";
import { Router } from "express";
import logger from "../utils/logger.js";

const pgnRouter = Router();

pgnRouter.get("/test-pgn", async (req, res) => {
  res.status(200).json({ message: "Hello Pgn", success: true });
});

pgnRouter.get("/pgn/:id", authGuard, async (req, res) => {
  const { id } = req.params;
  const pgn = await Pgn.findById(id);
  if (!pgn) {
    return res.status(404).json({ message: "PGN not found", success: false });
  } else if (pgn.userId !== String(req.user.id)) {
    return res.status(403).json({ message: "You are not authorized to access this PGN", success: false });
  }
  res.status(200).json({ pgn, success: true });
});

pgnRouter.get("/pgns", authGuard, async (req, res) => {
  try {
    const pgns = await Pgn.find({ userId: req.user.id });
    logger.debug(`Found ${pgns.length} PGNs for user ${req.user.username}`);
    res.status(200).json({ pgns, success: true });
  } catch (error) {
    logger.error(`Error fetching PGNs for user ${req.user.username}: ${error}`);
    res.status(500).json({ message: "Error fetching PGNs", success: false });
  }
});

pgnRouter.post("/pgn", authGuard, async (req, res) => {
  try {
    const { title, pgn, notes, isPublic = false } = req.body;

    // check if title already exists
    const existingPgns = await Pgn.find({ userId: req.user.id });
    if (existingPgns.some((pgn) => pgn.title === title)) {
      return res
        .status(400)
        .json({ message: "Title already exists", success: false });
    }

    // Add PGN to database
    const newPgn = new Pgn({
      userId: req.user.id,
      title,
      pgn,
      notes,
      isPublic,
    });
    await newPgn.save();

    // Return success message
    res.status(201).json({
      message: "PGN added successfully",
      success: true,
      pgn: newPgn,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding PGN", success: false });
  }
});

pgnRouter.patch("/pgn/:id", authGuard, async (req, res) => {
  logger.debug(`[pgnRouter] Patching PGN ${req.params.id} with ${JSON.stringify(req.body)}`);
  try {
    const { id } = req.params;

    // Check if PGN exists & user has access rights
    const pgn = await Pgn.findById(id);
    if (!pgn) {
      return res
        .status(404)
        .json({ message: "PGN not found", success: false });
    } else if (pgn.userId !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this PGN", success: false });
    }

    // Update PGN
    const updatedPgn = await Pgn.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "PGN updated successfully",
      success: true,
      pgn: updatedPgn,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating PGN", success: false });
  }
});

pgnRouter.delete("/pgn/:id", authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const pgn = await Pgn.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "PGN deleted successfully", success: true, pgn });
  } catch (error) {
    res.status(500).json({ message: "Error deleting PGN", success: false });
  }
});

export default pgnRouter;
