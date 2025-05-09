export type UserType = {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string; // ISO
}

export type NodeType = {
  move: string;
  moveNum: number;
  isWhite: boolean;
  fen: string;
  numLeafChildren: number;
  children: NodeType[];
  parent: NodeType | null;
}

export type PgnType = {
  _id: string;
  title: string;
  moveText: string;
  notes: string;
  isPublic: boolean;
  gameProgress: {
    visitedBranchingNodes: NodeType[];
    currentNode: NodeType;
  };
  gameSettings: {
    isPlayingWhite: boolean;
    isSkipping: boolean;
  };
  gameMetadata: {
    fenBeforeFirstBranch: string;
  };
  userId: string;
  createdAt: Date;
}