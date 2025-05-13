import util from 'util';
import { Chess } from 'chess.js';
import { MoveNode } from '@/types/chess';

// Turns a nested pgn into a set of mainline pgns.
export const moveTextToMainlines = (moveText: string) => {
  const mainlines: string[] = [];
  const tokens = moveText.split(/\s+/).filter(token => token.trim() !== '');
  
  /**
   * Recursively processes PGN tokens to extract mainlines, handling variations (parentheses).
   * 
   * @param i - Current position in the tokens array
   * @param currentLine - Array of moves in the current line being built
   * @returns Tuple containing [endIndex, sublines]; endIndex is the index of end parenthesis 
   *          where the outer variation ended; sublines is an array of complete move sequences 
   *          from this variation
   */
  const backtrack = (i: number, currentLine: string[]): [number, string[]] => {
    while (i < tokens.length) {
      const move = tokens[i];
      // Backtrack on opening parenthesis and deep copy currentLine
      if (move === '(') {
        let addBack: string = currentLine.pop() || '';
        const [newIndex, sublines] = backtrack(i + 1, currentLine.slice());
        currentLine.push(addBack);
        mainlines.push(...sublines);
        i = newIndex;
      } 
      // Return from backtrack on closing parenthesis
      else if (move === ')') {
        return [i, [currentLine.join(' ')]];
      } 
      // Keep building the line
      else if (!move.includes('...')) {
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


/**
 * Converts an array of PGN mainlines into a tree structure of chess moves. Each node in the tree 
 * represents a position reached after the move, with branches for different variations.
 * 
 * @param mainlines - Array of strings, each representing a sequence of moves in a variation. 
 *                    Each move should be stripped of move numbers and ellipses (e.g., "e4 e5 Nf3").
 * @returns A MoveNode representing the root of the move tree. The root is a sentinel node (empty move) 
 *          with the actual game moves starting in its children. Each MoveNode contains:
 */
const mainlinesToMoveTree = (mainlines: string[]) => {
  const sentinalNode: MoveNode = {
    move: '',
    moveNum: 0,
    isWhite: false,
    fen: '',
    children: [],
    parent: null,
    numLeafChildren: 0,
  };

  for (const lineStr of mainlines) {
    const lineArr: string[] = lineStr.split(' ').filter(move => !/[0-9]./.test(move) && move !== '');
    let currNode: MoveNode = sentinalNode;
    let isWhite: boolean = true;
    let moveNum: number = 1;
    
    // Create a new chess instance for this line
    const chess = new Chess();

    for (const move of lineArr) {
      chess.move(move);

      // Add new node to children if it doesn't exist
      if (!currNode.children.find(child => child.move === move)) {
        const newNode: MoveNode = {
          move,
          moveNum,
          isWhite,
          fen: chess.fen(), // Store the FEN after making the move
          children: [],
          parent: currNode,
          numLeafChildren: 0,
        };
        currNode.children.push(newNode);
      }

      // Move to the next node
      currNode = currNode.children.find(child => child.move === move)!;
      if (!isWhite) moveNum++;
      isWhite = !isWhite;
    }
    
    // Reset chess instance for next line
    chess.reset();
  }
  return sentinalNode;
};


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

/**
 * Creates a pretty-printed string representation of the move tree.
 * Each move is shown with its number and color, and the tree structure is represented with indentation.
 */
const prettyPrintMoveTree = (node: MoveNode, verbose: boolean = false): string => {
  if (verbose) {
    return util.inspect(node, { depth: null, colors: true });
  } else 
  return prettyPrintMoveTreeHelper(node, 0);
};

const prettyPrintMoveTreeHelper = (node: MoveNode, depth: number = 0): string => {
  const indent = '  '.repeat(depth);
  const moveText = node.move ? 
    `${node.moveNum}${node.isWhite ? '.' : '...'} ${node.move}` : 
    'root';
  
  let result = `${indent}${moveText}\n`;
  for (const child of node.children) {
    result += prettyPrintMoveTreeHelper(child, depth + 1);
  }
  return result;
};

// For testing. Will only run if this file is run directly.
if (typeof process !== 'undefined' && process.argv && import.meta.url === new URL(process.argv[1], 'file://').href) {
  const moveText = `
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 b5 
( 4... Nf6 5. O-O Nxe4 6. Re1 Nd6 ) 
5. Bb3 Nf6 6. O-O *
`
  const moveText2 = `
1. e4 
( 1. d4 d5 2. Kd2 ) 
1... e5 2. Nf3
`
  const mainlines = moveTextToMainlines(moveText2);
  const moveTree = mainlinesToMoveTree(mainlines);
  console.log('move tree\n', prettyPrintMoveTree(moveTree, true));
}

export const hashMoveNode = (moveNode: MoveNode): string => {
  return `${moveNode.fen}-${moveNode.moveNum}-${moveNode.move}-${moveNode.isWhite}`;
}
