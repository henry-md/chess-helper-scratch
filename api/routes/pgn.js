import { User } from "../models/User.js";
import { Pgn } from "../models/Pgn.js";
import { authGuard } from "../middleware/auth-guard.js";
import { Router } from 'express';

const pgnRouter = Router();

pgnRouter.get("/test-pgn", async (req, res) => {
  res.status(200).json({ message: "Hello Pgn", success: true });
});

pgnRouter.get("/pgns", async (req, res) => {
  try {
    const pgns = await Pgn.find({ userId: req.userId });
    res.status(200).json({ pgns, success: true });
  } catch (error) {
    res.status(500).json({ message: "Error fetching PGNs", success: false });
  }
})

pgnRouter.post("/pgn", async (req, res) => {
  try {
    const { title, pgn, notes } = req.body;

    // check if title already exists
    const existingPgns = await Pgn.find({ userId: req.userId });
    if (existingPgns.some(pgn => pgn.title === title)) {
      return res.status(400).json({ message: "Title already exists", success: false });
    }

    // Add PGN to database
    const newPgn = new Pgn({ title, pgn, notes, userId: req.userId });
    await newPgn.save();

    // Return success message
    res.status(201).json({ 
      message: "PGN added successfully", 
      success: true,
      pgn: newPgn
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding PGN", success: false });
  }
});

pgnRouter.patch("/pgn/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pgn, notes } = req.body;

    const updatedPgn = await Pgn.findByIdAndUpdate(id, { title, pgn, notes }, { new: true });
    res.status(200).json({ message: "PGN updated successfully", success: true, pgn: updatedPgn });
  } catch (error) {
    res.status(500).json({ message: "Error updating PGN", success: false });
  }
})

pgnRouter.delete("/pgn/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pgn = await Pgn.findByIdAndDelete(id);
    res.status(200).json({ message: "PGN deleted successfully", success: true, pgn });
  } catch (error) {
    res.status(500).json({ message: "Error deleting PGN", success: false });
  }
});

export default pgnRouter;