/* should match web/src/types/chess.ts */

export interface MoveNode {
  move: string;
  moveNum: number;
  isWhite: boolean;
  fen: string;
  children: MoveNode[];
  parent: MoveNode | null;
  numLeafChildren: number;
}
