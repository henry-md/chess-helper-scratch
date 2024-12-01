const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Put pgnSchema inside userSchema to avoid an O(n) lookup
const pgnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  pgn: {
    type: String,
    required: true
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  pgns: [pgnSchema],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre("save", async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

module.exports = mongoose.model("User", userSchema);
