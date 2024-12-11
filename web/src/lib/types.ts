export type UserType = {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string; // ISO
}

export type PgnType = {
  _id: string;
  title: string;
  pgn: string;
  notes: string;
  userId: string;
  createdAt: Date;
}