import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Board from "./components/Board";


function App() {
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [textareaContent, setTextareaContent] = useState('');

  const handleTextareaChange = (event) => {
    setTextareaContent(event.target.value);
  };

  return (
    <>
      <div className="w-full h-[100vh] flex justify-center items-center">
        <div className="w-[600px]">
          <Board PgnTree={{}}/>
        </div>
        <textarea 
          value={textareaContent}
          onChange={handleTextareaChange}
          className="ml-4 p-2 border border-gray-300 rounded h-[300px]"
          placeholder="Type here..."
        />
      </div>
    </>
  )
}

export default App;
