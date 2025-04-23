export type UserType = {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string; // ISO
}

export type PgnBodyType = {
  title: string;
  moveText: string;
  notes: string;
  isPublic: boolean;
}

export type PgnType = {
  _id: string;
  title: string;
  moveText: string;
  notes: string;
  userId: string;
  createdAt: Date;
}