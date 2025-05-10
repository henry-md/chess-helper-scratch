import { Chess } from 'chess.js';

export const getFenBeforeFirstBranch = (pgn: string) => {
  const moves = pgn.split(/\s+/).filter(token => token.trim() !== '');
  const chess = new Chess();
  
  for (const move of moves) {
    if (/[0-9]/.test(move[0]) || move.includes('...')) continue;
    if (move.includes('(')) break;
    chess.move(move);
  }
  return chess.fen();
};


