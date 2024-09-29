import { useState, useMemo, useCallback, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";



function App() {
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

  return (
    <>
      <div className="w-[600px]">
        <Chessboard id="BasicBoard" />
      </div>
      <textarea />
    </>
  )
}

export default App;
