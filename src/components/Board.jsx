import { useState, useEffect, useCallback, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import PropTypes from 'prop-types';


const Board = ({ mainlines, isWhite }) => {
  const chessRef = useRef(new Chess());
  const movesRef = useRef([]);
  const currMoveIdxRef = useRef(-1);
  const maxMoveIdxRef = useRef(-1);
  const lineIdxRef = useRef(0);
  const [currFen, setCurrFen] = useState('');

  // Load game history, set key tracking
  const loadNextGame = useCallback(() => {
    if (!mainlines || mainlines.length === 0) {
      chessRef.current.reset();
      setCurrFen(chessRef.current.fen());
      return;
    };
    chessRef.current.loadPgn(mainlines[lineIdxRef.current]);
    movesRef.current = chessRef.current.history();
    chessRef.current.reset();
    setCurrFen(chessRef.current.fen());
  }, [mainlines, lineIdxRef]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight' && currMoveIdxRef.current < maxMoveIdxRef.current) {
      currMoveIdxRef.current++;
      chessRef.current.move(movesRef.current[currMoveIdxRef.current]);
      setCurrFen(chessRef.current.fen());
    } else if (event.key === 'ArrowLeft' && currMoveIdxRef.current >= 0) {
      chessRef.current.undo();
      currMoveIdxRef.current--;
      setCurrFen(chessRef.current.fen());
    }
  }, []);

  const onDrop = (sourceSquare, targetSquare) => {
    const chess = chessRef.current;

    // Check if there's a next move in the history
    if (currMoveIdxRef.current < movesRef.current.length - 1) {
      const nextMove = movesRef.current[currMoveIdxRef.current + 1];
      const moveAttempt = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity
      });

      if (moveAttempt && moveAttempt.san === nextMove) {
        // Move is correct
        currMoveIdxRef.current++;
        maxMoveIdxRef.current = Math.max(maxMoveIdxRef.current, currMoveIdxRef.current);
        setCurrFen(chess.fen());
        return true;
      } else {
        // Move is incorrect: reset the position
        setCurrFen(chess.fen());
        setTimeout(() => {
          chess.undo();
          setCurrFen(chess.fen());
        }, 100);
        return true; // allow move no matter what temporarily
      }
    }

    // If we're at the end of the game history, don't allow any moves
    return false;
  };

  useEffect(() => {
    loadNextGame();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [loadNextGame, handleKeyDown]);

  return (
    <Chessboard
      id="BasicBoard"
      arePiecesDraggable={true}
      customDragLayers={[]}
      position={currFen}
      onPieceDrop={onDrop}
      boardOrientation={isWhite ? 'white' : 'black'}
    />
  );
};

Board.propTypes = {
  mainlines: PropTypes.array.isRequired,
};

export default Board;