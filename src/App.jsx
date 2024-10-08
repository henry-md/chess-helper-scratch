import { useState, useRef, useCallback, useEffect } from 'react';
import Board from "./components/Board";
import { Chess } from "chess.js";

function App() {
  const [textareaContent, setTextareaContent] = useState('');
  const [mainlines, setMainlines] = useState([]);
  const [isPlayingWhite, setIsPlayingWhite] = useState(true);
  const [currFen, setCurrFen] = useState('');

  const chessRef = useRef(new Chess());
  const movesRef = useRef([]);
  const currMoveIdxRef = useRef(-1);
  const maxMoveIdxRef = useRef(-1);
  const lineIdxRef = useRef(0);

  const handleTextareaChange = (event) => {
    if (event.target.value === '') return
    console.log('content', event.target.value);
    setTextareaContent(event.target.value);
    setMainlines(pgnToMainlines(event.target.value));
    console.log('mainlines', mainlines);
  };

  // turns a nested pgn into a set of mainline pgns.
  const pgnToMainlines = (pgn) => {
    const mainlines = [];
    const moves = pgn.split(/\s+/).filter(token => token.trim() !== '');
    
    // returns [line_end_idx, [line,]]
    const backtrack = (index, currentLine) => {
      let i = index;
      let addBack;
      while (i < moves.length) {
        const move = moves[i];
        if (move === '(') {
          // enter backtrack
          addBack = currentLine.pop();
          const [newIndex, sublines] = backtrack(i + 1, currentLine.slice());
          currentLine.push(addBack);
          mainlines.push(...sublines);
          i = newIndex;
        } else if (move === ')') {
          // return from backtrack
          return [i, [currentLine.join(' ')]];
        } else if (!move.includes('...')) {
          // It's an actual move
          currentLine.push(move);
        }
        i++;
      }
      // Reached end of pgn
      mainlines.push(currentLine.join(' '));
      return [i, []];
    };
  
    backtrack(0, []);
    return mainlines.reverse();
  };

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
    currMoveIdxRef.current = -1;
    maxMoveIdxRef.current = movesRef.current.length - 1;
  }, [mainlines]);

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

  const playComputerMove = () => {
    setTimeout(() => {
      if (currMoveIdxRef.current === movesRef.current.length - 1) return;
      currMoveIdxRef.current++;
      chessRef.current.move(movesRef.current[currMoveIdxRef.current]);
      setCurrFen(chessRef.current.fen());
    }, 200);
  };

  const getHint = () => {
    console.log('getHint');
    console.log(currMoveIdxRef.current, movesRef.current.length - 1);
    if (currMoveIdxRef.current === movesRef.current.length - 1) return;
    console.log('getting here');
    currMoveIdxRef.current++;
    chessRef.current.move(movesRef.current[currMoveIdxRef.current]);
    setCurrFen(chessRef.current.fen());
    setTimeout(() => {
      chessRef.current.undo();
      currMoveIdxRef.current--;
      setCurrFen(chessRef.current.fen());
    }, 500);
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const chess = chessRef.current;

    if (currMoveIdxRef.current < movesRef.current.length - 1) {
      const nextMove = movesRef.current[currMoveIdxRef.current + 1];
      const moveAttempt = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (moveAttempt && moveAttempt.san === nextMove) {
        currMoveIdxRef.current++;
        maxMoveIdxRef.current = Math.max(maxMoveIdxRef.current, currMoveIdxRef.current);
        setCurrFen(chess.fen());

        if (currMoveIdxRef.current === movesRef.current.length - 1) {
          lineIdxRef.current++;
          loadNextGame();
        } else {
          playComputerMove();
        }
        return true;
      } else {
        setCurrFen(chess.fen());
        setTimeout(() => {
          chess.undo();
          setCurrFen(chess.fen());
        }, 100);
        return true;
      }
    }

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
    <>
      <div className="w-full h-[100vh] flex justify-center items-center">
        <div className="w-[600px]">
          <Board 
            currFen={currFen} 
            onPieceDrop={onDrop}
            isWhite={isPlayingWhite}
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-2 px-3">
          <button 
            className="p-2 rounded w-full border border-gray-300 hover:bg-gray-100"
            onClick={getHint}
          >
            Hint
          </button>
          <textarea 
            value={textareaContent}
            onChange={handleTextareaChange}
            className="p-2 border border-gray-300 rounded h-[400px]"
            placeholder="Type here..."
          />
          <div className="flex flex-row justify-center items-center gap-2">
            Play as:
            <button 
              className={`w-[25px] h-[25px] bg-[#f0d9b5] rounded-md ${isPlayingWhite ? 'border-2 border-[#827662]' : ''} box-border`} 
              onClick={() => setIsPlayingWhite(true)}
            ></button>
            <button 
              className={`w-[25px] h-[25px] bg-[#b58863] rounded-md ${!isPlayingWhite ? 'border-2 border-[#827662]' : ''} box-border`} 
              onClick={() => setIsPlayingWhite(false)}
            ></button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
