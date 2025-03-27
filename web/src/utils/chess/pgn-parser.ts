// turns a nested pgn into a set of mainline pgns.
export const pgnToMainlines = (pgn: string) => {
  const mainlines: string[] = [];
  const moves = pgn.split(/\s+/).filter(token => token.trim() !== '');
  
  // returns [line_end_idx, [line,]]
  const backtrack = (index: number, currentLine: string[]) => {
    let i = index;
    let addBack: string;
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


export const findNumMovesToFirstBranch = (pgn: string) => {
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
