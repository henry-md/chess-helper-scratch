import React, { useState } from "react";
import { Chessboard } from "react-chessboard";

const Board = ({PgnTree}) => {
  const [gameHistory, setGameHistory] = useState(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']);

  return (
    <Chessboard
      id="BasicBoard"
      arePiecesDraggable={true}
      customDragLayers={[]}
    />
  );
};

export default Board;
