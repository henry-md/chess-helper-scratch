const User = require("../models/User");

const addPgn = async (req, res) => {
  try {
    // Try to get user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Update user PGN
    const { title, pgn, notes } = req.body;
    if (user.pgns.some(pgn => pgn.title === title)) {
      return res.status(400).json({ message: "Title already exists", success: false });
    }
    user.pgns.push({ title, pgn, notes });
    await user.save();

    // Return success message
    res.status(201).json({ 
      message: "PGN added successfully", 
      success: true,
      pgn: user.pgns[user.pgns.length - 1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding PGN", success: false });
  }
};

const deletePgn = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const { title } = req.body;
    const pgnToDelete = user.pgns.find(pgn => pgn.title === title);
    if (!pgnToDelete) {
      return res.status(400).json({ message: "Title not found", success: false });
    }
    user.pgns = user.pgns.filter(pgn => pgn.title !== title);
    await user.save();

    res.status(200).json({ 
      message: "PGN deleted successfully", 
      success: true, 
      pgn: pgnToDelete
    });
  } catch (error) {
    console.error(error);
i  }
};

module.exports = {
  addPgn,
  deletePgn
};