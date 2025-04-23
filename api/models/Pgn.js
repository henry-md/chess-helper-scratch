import mongoose from "mongoose";

// Define the reusable node schema
const nodeSchema = {
  move: String,
  fen: String,
};

// Put pgnSchema inside userSchema to avoid an O(n) lookup
const pgnSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  moveText: {
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
  gameProgress: {
    visitedBranchingNodes: [nodeSchema],
    currentNode: nodeSchema,
  },
  gameSettings: {
    isPlayingWhite: Boolean,
    isSkipping: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Pgn = mongoose.model("Pgn", pgnSchema);
