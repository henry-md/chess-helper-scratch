import React, { useState, useEffect, useCallback, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const Board = ({ PgnTree }) => {
  const [currFen, setCurrFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const chessRef = useRef(new Chess());
  const currentIndexRef = useRef(-1);
  const movesRef = useRef([]);

  const initializeGame = useCallback(() => {
    const pgn = "1. h4 a5 2. h5 a4 3. b4 axb3 4. h6 b2 5. hxg7 bxa1=Q 6. gxh8=Q Qxa2 7. d3 Nc6 8. Nd2 Nb4 9. Ndf3 Qa3 10. Qxg8 Qa2 11. Rxh7 Qa3 12. Qxf7# ";
    chessRef.current.loadPgn(pgn);
    movesRef.current = chessRef.current.history();
    console.log('initializing game', chessRef.current.history());
    chessRef.current.reset();
    setCurrFen(chessRef.current.fen());
  }, []);

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

export default Board;