import mongoose from "mongoose";

// Define the reusable node schema
const nodeSchema = new mongoose.Schema({
  move: String,
  moveNum: Number,
  isWhite: Boolean,
  fen: String,
  numLeafChildren: Number,
});

// Add recursive references after initial definition
nodeSchema.add({
  children: [nodeSchema],
  parent: {
    type: nodeSchema,
    default: null,
  },
});

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
  gameMetadata: {
    fenBeforeFirstBranch: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Pgn = mongoose.model("Pgn", pgnSchema);
