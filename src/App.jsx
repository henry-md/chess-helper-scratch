import { useState, useRef } from "react";
import Board from "./components/Board";
// import PgnGenerator from "./utils/PgnGenerator.js";

function App() {
  const [textareaContent, setTextareaContent] = useState('');

  const handleTextareaChange = (event) => {
    setTextareaContent(event.target.value);
  };

  /* turns a nested pgn into a set of mainline pgns.
  Ex input:
  1. e4 e5 
  ( 1... d5 2. exd5 ) 
  2. Nf3 Nc6 
  ( 2... Nf6 3. Nxe5 ) 
  3. Bb5 a6 4. Ba4 b5 
  ( 4... Nf6 5. O-O Nxe4 6. Re1 ) 
  5. Bb3 

  Ex output:
  [
    "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 b5 5. Bb3",
    "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Nxe4 6. Re1",
    "1. e4 e5 2. Nf3 Nf6 3. Nxe5",
    "1. e4 d5 2. exd5"
  ]
  (the pgns can be returned in any order)
  */
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
    return mainlines;
  };
  
  // Test the function
  const testPgn = `1. e4 e5 
  ( 1... d5 2. exd5 ) 
  2. Nf3 Nc6 
  ( 2... Nf6 3. Nxe5 ) 
  3. Bb5 a6 4. Ba4 b5 
  ( 4... Nf6 5. O-O Nxe4 6. Re1 ) 
  5. Bb3`;
  
  console.log(pgnToMainlines(testPgn));

  return (
    <>
      <div className="w-full h-[100vh] flex justify-center items-center">
        <div className="w-[600px]">
          <Board pgn={"1. e4"}/>
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
