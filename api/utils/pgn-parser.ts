import { Chess } from 'chess.js';
import { MoveNode } from '../types/chess';

export const getFenBeforeFirstBranch = (pgn: string): string => {
  const moves = pgn.split(/\s+/).filter(token => token.trim() !== '');
  const chess = new Chess();
  
  for (const move of moves) {
    if (/[0-9]/.test(move[0]) || move.includes('...')) continue;
    if (move.includes('(')) break;
    chess.move(move);
  }
  return chess.fen();
};

export const hashMoveNode = (moveNode: MoveNode): string => {
  return `${moveNode.fen}-${moveNode.moveNum}-${moveNode.move}-${moveNode.isWhite}`;
}
