import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    primaryKey: true,
  },
  userId: {
    type: String, // to work with Lucia
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const Session = mongoose.model("Session", sessionSchema);
