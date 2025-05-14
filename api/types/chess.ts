/* Should match web/src/lib/types.ts */
export interface MoveNode {
  move: string;
  moveNum: number;
  isWhite: boolean;
  fen: string;
  children: MoveNode[];
  parent: MoveNode | null;
  numLeafChildren: number;
}