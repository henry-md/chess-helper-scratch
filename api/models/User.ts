import mongoose from "mongoose";


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
  passwordHash: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// Handles User.deleteOne() and User.findOneAndDelete()
userSchema.pre('deleteOne', async function() {
  const userId = this.getQuery()._id;
  await mongoose.model('Pgn').deleteMany({ userId });
});

// Handles document.remove() on a single user instance
userSchema.pre('remove', async function() {
  await mongoose.model('Pgn').deleteMany({ userId: this._id });
});

export const User = mongoose.model("User", userSchema);
