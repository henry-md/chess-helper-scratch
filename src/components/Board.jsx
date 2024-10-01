import React, { useState, useEffect, useCallback, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import PropTypes from 'prop-types';


const Board = ({ pgn }) => {
  const chessRef = useRef(new Chess());
  const movesRef = useRef([]);
  const currentIndexRef = useRef(-1);
  const [currFen, setCurrFen] = useState('');

  // Load game history, set key tracking
  const initializeGame = useCallback(() => {
    chessRef.current.loadPgn(pgn);
    movesRef.current = chessRef.current.history();
    chessRef.current.reset();
    setCurrFen(chessRef.current.fen());
  }, [pgn]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight' && currentIndexRef.current < movesRef.current.length - 1) {
      currentIndexRef.current++;
      chessRef.current.move(movesRef.current[currentIndexRef.current]);
      setCurrFen(chessRef.current.fen());
    } else if (event.key === 'ArrowLeft' && currentIndexRef.current >= 0) {
      chessRef.current.undo();
      currentIndexRef.current--;
      setCurrFen(chessRef.current.fen());
    }
  }, []);

  const onDrop = (sourceSquare, targetSquare) => {
    const chess = chessRef.current;
    const currentIndex = currentIndexRef.current;

    // Check if there's a next move in the history
    if (currentIndex < movesRef.current.length - 1) {
      const nextMove = movesRef.current[currentIndex + 1];
      const moveAttempt = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity
      });

      if (moveAttempt && moveAttempt.san === nextMove) {
        // Move is correct
        currentIndexRef.current++;
        setCurrFen(chess.fen());
        return true;
      } else {
        // Move is incorrect: reset the position
        setCurrFen(chess.fen());
        setTimeout(() => {
          chess.undo();
          setCurrFen(chess.fen());
        }, 100);
        return true; // allow move temporarily
      }
    }

    // If we're at the end of the game history, don't allow any moves
    return false;
  };

  useEffect(() => {
    initializeGame();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [initializeGame, handleKeyDown]);

  return (
    <Chessboard
      id="BasicBoard"
      arePiecesDraggable={true}
      customDragLayers={[]}
      position={currFen}
      onPieceDrop={onDrop}
    />
  );
};

Board.propTypes = {
  pgn: PropTypes.string.isRequired,
};

export default Board;