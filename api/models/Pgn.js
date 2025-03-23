import mongoose from "mongoose";

// Put pgnSchema inside userSchema to avoid an O(n) lookup
const pgnSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
  },
  pgn: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: "",
    required: false,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export const Pgn = mongoose.model("Pgn", pgnSchema);
