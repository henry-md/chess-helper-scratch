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
    console.log('setting chess position to', chessRef.current.fen());
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
    />
  );
};

Board.propTypes = {
  pgn: PropTypes.string.isRequired,
};

export default Board;