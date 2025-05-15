import { useStore } from "@nanostores/react";
import { $pgnDict } from "@/store/pgn";
import { $currentLine, $currentLineIdx, setCurrentLineIdx } from "@/store/game-core";
import { useEffect, useState, useCallback } from "react";
import { MoveNode, StoredPgn } from "@/lib/types";
import { mainlinesToMoveTree, moveTextToMainlines } from "@/utils/chess/pgn-parser";

const useGame = (pgn: StoredPgn) => {
  const [currentNode, setCurrentNode] = useState<MoveNode>(() => 
    mainlinesToMoveTree(moveTextToMainlines(pgn.moveText))
  );

  // Game history
  const currentLine: string[] = useStore($currentLine); // list of fen strings
  const currentLineIdx: number = useStore($currentLineIdx);
  
  // Game settings
  const isPlayingWhite = pgn.gameSettings.isPlayingWhite;
  const isSkipping = pgn.gameSettings.isSkipping;

  // Can I put this in a callback?
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      if (currentLineIdx < currentLine.length - 1) {
        setCurrentFen(currentLine[currentLineIdx + 1]);
        setCurrentLineIdx(currentLineIdx + 1);
      }
    } else if (event.key === 'ArrowLeft') {
      if (currentLineIdx > 0) {
        setCurrentFen(currentLine[currentLineIdx - 1]);
        setCurrentLineIdx(currentLineIdx - 1);
      }
    }
  }

  const getHint = () => {
    if (currentLineIdx === currentLine.length - 1) return;
    const nextFen = currentNode.children[0].fen;
    setCurrentFen(nextFen);
    setTimeout(() => {
      setCurrentFen(currentNode.fen);
    }, 500);
  }

  // Weight randomly for now
  const playComputerMove = () => {
    if (currentNode.children.length === 0) return;
    const randomIndex = Math.floor(Math.random() * currentNode.children.length);
    const nextFen = currentNode.children[randomIndex].fen;
    setCurrentFen(nextFen);
    setTimeout(() => {
      setCurrentFen(currentNode.fen);
    }, 500);
  }

  return {
    fen: currentNode.fen,
  };
}

export default useGame;