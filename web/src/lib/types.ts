
/* Should match api/models/User.ts */
export type IUser = {
  email: string;
  username: string;
  passwordHash: string;
}

export type IUserDocument = IUser & {
  _id: string;
  createdAt: Date; // ISO
}

export type StoredUser = IUser & {
  _id: string;
  createdAt: string; // ISO
}

/* Should match api/models/Pgn.ts */
export type IPgn = {
  userId: string;
  title: string;
  moveText: string;
  notes: string;
  isPublic: boolean;
  gameProgress: {
    visitedNodeHashes: string[];
  };
  gameSettings: {
    isPlayingWhite: boolean;
    isSkipping: boolean;
  };
  gameMetadata: {
    fenBeforeFirstBranch: string;
  };
}

export type IPgnDocument = IPgn & {
  _id: string; // Question: not mongoose.ObjectId?
  createdAt: Date;
}

export type StoredPgn = IPgn & {
  _id: string;
  createdAt: string; // ISO
}

/* Should match api/types/chess.ts */
export interface MoveNode {
  move: string;
  moveNum: number;
  isWhite: boolean;
  fen: string;
  children: MoveNode[];
  parent: MoveNode | null;
  numLeafChildren: number;
}