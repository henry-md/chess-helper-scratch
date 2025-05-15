import { useStore } from "@nanostores/react";
import { $pgnDict } from "@/store/pgn";
import { $currentPgnId, $currentLine, $currentLineIdx, setCurrentLineIdx } from "@/store/game-core";
import { useEffect, useState, useCallback } from "react";
import { MoveNode, IPgnDocument } from "@/lib/types";

const useGame = (pgn: IPgnDocument) => {
  const [currentNode, setCurrentNode] = useState<MoveNode>(currentPgn.gameProgress.currentNode);
  // const currentFen: string = currentNode.fen;
  const [currentFen, setCurrentFen] = useState<string>(currentNode.fen);

  // Game history
  const currentLine: string[] = useStore($currentLine); // list of fen strings
  const currentLineIdx: number = useStore($currentLineIdx);
  
  // Game settings
  const isPlayingWhite = currentPgn.gameSettings.isPlayingWhite;
  const isSkipping = currentPgn.gameSettings.isSkipping;

  // Let Nanostores be single source of truth for fen
  useEffect(() => {
    setCurrentNode(currentPgn.gameProgress.currentNode);
    setCurrentFen(currentPgn.gameProgress.currentNode.fen);
  }, [currentPgnId, currentPgn.gameProgress.currentNode]);

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
    currentNode,
    currentFen,
    currentLineIdx,
    
  };
}

export default useGame;