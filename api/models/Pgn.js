import mongoose from "mongoose";

// Put pgnSchema inside userSchema to avoid an O(n) lookup
const pgnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  pgn: {
    type: String,
    required: true,
  },
  notes: String,
  userId: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export const Pgn = mongoose.model("Pgn", pgnSchema);
