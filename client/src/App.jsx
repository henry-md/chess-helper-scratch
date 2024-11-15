import { useState, useRef, useCallback, useEffect } from 'react';
import Board from "./components/Board";
import { Chess } from "chess.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [textareaContent, setTextareaContent] = useState('');
  const [mainlines, setMainlines] = useState([]);
  const [isPlayingWhite, setIsPlayingWhite] = useState(true);
  const [isSkipping, setIsSkipping] = useState(false);
  const [numMovesToFirstBranch, setNumMovesToFirstBranch] = useState(0);
  
  const [currFen, setCurrFen] = useState('');
  const chessRef = useRef(new Chess());
  const movesRef = useRef([]);
  const currMoveIdxRef = useRef(-1);
  const maxMoveIdxRef = useRef(-1);
  const lineIdxRef = useRef(0);

  const handleTextareaChange = (event) => {
    console.log('content', event.target.value);
    setTextareaContent(event.target.value);
    if (event.target.value === '') return
    setMainlines(pgnToMainlines(event.target.value));
    setNumMovesToFirstBranch(findNumMovesToFirstBranch(event.target.value));
    console.log('mainlines', pgnToMainlines(event.target.value));
  };

  const findNumMovesToFirstBranch = (pgn) => {
    let numMoves = 0;
    const moves = pgn.split(/\s+/).filter(token => token.trim() !== '');
    console.log('moves', moves);
    for (const move of moves) {
      // if the first character is a number, continue
      if (/[0-9]/.test(move[0])) continue;
      if (move.includes('(')) break;
      numMoves++;
    }
    return numMoves - 1;
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
    // mainlinesToTree(mainlines);
    return mainlines.reverse();
  };

  // const mainlinesToTree = (mainlines) => {
  //   console.log('mainlines', mainlines);
  //   const tree = {};
  //   for (const line of mainlines) {
  //     // check that move does not have any numerical character in it, and is not empty
  //     const moves = line.split(' ').filter(move => !/[0-9]/.test(move) && move !== '');
  //     console.log('line', line);
  //     console.log('moves', moves);
  //     break;
  //     let currNode = tree;
  //     for (const move of moves) {
  //       if (!currNode[move]) {
  //         currNode[move] = {};
  //       }
  //       currNode = currNode[move];
  //     }
  //   }
  //   return tree;
  // };

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

  const getHint = () => {
    if (currMoveIdxRef.current === movesRef.current.length - 1) return;
    currMoveIdxRef.current++;
    chessRef.current.move(movesRef.current[currMoveIdxRef.current]);
    setCurrFen(chessRef.current.fen());
    setTimeout(() => {
      chessRef.current.undo();
      currMoveIdxRef.current--;
      setCurrFen(chessRef.current.fen());
    }, 500);
  };

  const playComputerMove = useCallback(() => {
    if (currMoveIdxRef.current === movesRef.current.length - 1) return;
    setTimeout(() => {
      currMoveIdxRef.current++;
      maxMoveIdxRef.current = Math.max(maxMoveIdxRef.current, currMoveIdxRef.current);
      chessRef.current.move(movesRef.current[currMoveIdxRef.current]);
      setCurrFen(chessRef.current.fen());
      console.log('currMoveIdxRef.current', currMoveIdxRef.current, 'of', movesRef.current.length - 1);
    }, 200);
  }, []);

  const loadNextGame = useCallback(() => {
    if (!mainlines || mainlines.length === 0) {
      console.log('trivial load');
      chessRef.current.reset();
      setCurrFen(chessRef.current.fen());
      return;
    };

    chessRef.current.loadPgn(mainlines[lineIdxRef.current]);
    movesRef.current = chessRef.current.history();
    chessRef.current.reset();
    setCurrFen(chessRef.current.fen());
    currMoveIdxRef.current = -1;
    maxMoveIdxRef.current = -1;

    // play moves until next branching variation
    if (isSkipping) {
      for (let i = 0; i < numMovesToFirstBranch; i++) {
        setTimeout(() => {
          playComputerMove();
        }, 300 * (i + 1));
      }
    }

    // play next move if after skipping (or not), it is your opponent's move
    let skippingMovesPlayed = isSkipping ? numMovesToFirstBranch : 0;
    if (isPlayingWhite && skippingMovesPlayed % 2 === 1) {
      playComputerMove();
    } else if (!isPlayingWhite && skippingMovesPlayed % 2 === 0) {
      playComputerMove();
    }

  }, [mainlines, isPlayingWhite, isSkipping, numMovesToFirstBranch, playComputerMove]);

  const getNextGameIfEnded = useCallback(() => {
    if (currMoveIdxRef.current === movesRef.current.length - 1) {
      lineIdxRef.current++;
      loadNextGame();
    }
  }, [loadNextGame]);

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

        if (currMoveIdxRef.current != movesRef.current.length - 1) {
          playComputerMove();
        }
        getNextGameIfEnded();
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

  // when the user changes the isPlayingWhite state, return currMoveIdxRef and maxMoveIdxRef to -1, and change lineIdxRef to 0
  useEffect(() => {
    currMoveIdxRef.current = -1;
    maxMoveIdxRef.current = -1;
    lineIdxRef.current = 0;
    loadNextGame();
  }, [isPlayingWhite, loadNextGame]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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
              onClick={() => {setIsPlayingWhite(false)}}
            ></button>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            Skip to first branch:
            <button 
              onClick={() => setIsSkipping(!isSkipping)}
            >
              <FontAwesomeIcon 
                className="text-[#411A06]" // dark: 411A06
                icon={isSkipping ? faToggleOn : faToggleOff} 
                size="lg"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
