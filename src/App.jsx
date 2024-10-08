import { useState } from "react";
import Board from "./components/Board";
// import PgnGenerator from "./utils/PgnGenerator.js";

function App() {
  const [textareaContent, setTextareaContent] = useState('');
  const [mainlines, setMainlines] = useState([]);

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

  return (
    <>
      <div className="w-full h-[100vh] flex justify-center items-center">
        <div className="w-[600px]">
          <Board mainlines={mainlines}/>
        </div>
        <textarea 
          value={textareaContent}
          onChange={handleTextareaChange}
          className="ml-4 p-2 border border-gray-300 rounded h-[600px]"
          placeholder="Type here..."
        />
      </div>
    </>
  )
}

export default App;
