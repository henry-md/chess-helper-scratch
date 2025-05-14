import { IPgnDocument, IUserDocument, StoredPgn, StoredUser } from "@/lib/types";

export const serializeUser = (user: IUserDocument): StoredUser => {
  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt.toISOString()
  };
};

export const serializePgn = (pgn: IPgnDocument): StoredPgn => {
  return {
    _id: pgn._id.toString(),
    userId: pgn.userId,
    title: pgn.title,
    moveText: pgn.moveText,
    notes: pgn.notes,
    isPublic: pgn.isPublic,
    gameProgress: pgn.gameProgress,
    gameSettings: pgn.gameSettings,
    gameMetadata: pgn.gameMetadata,
    createdAt: pgn.createdAt.toISOString()
  };
};