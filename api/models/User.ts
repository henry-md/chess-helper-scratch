import mongoose, { Document, Types } from "mongoose";

export interface IUser {
  email: string;
  username: string;
  passwordHash: string;
}

// Document adds properties like _id, createdAt, etc.
export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
}

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

// Before deleting a user, delete all their Pgns (remove hook is deprecated)
userSchema.pre("deleteOne", async function () {
  const userId = this.getQuery()._id;
  await mongoose.model("Pgn").deleteMany({ userId });
});

export const User = mongoose.model<IUserDocument>("User", userSchema);
