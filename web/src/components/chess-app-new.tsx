import { useState, useRef, useCallback, useEffect, MutableRefObject } from 'react';
import { useStore } from '@nanostores/react'
import { NODE_ENV } from "@/env";
import { cn } from '../lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'

import Board from "./board";
import { Chess, Move } from "chess.js";

// Store
import { $pgn } from '../store/pgn';
import { $numMovesToFirstBranch, $gameOver, setGameOver } from '../store/game-core'

import EditPgnDialog from './board-edit-dialog';
import { MoveNode, StoredPgn } from '@/lib/types';
import { moveTextToMainlines, mainlinesToMoveTree } from '@/utils/chess/pgn-parser';

import useSkipping from '@/hooks/game/use-skipping';
import usePlayingColor from '@/hooks/game/use-playing-color';
import { toast } from 'react-toastify';
import { hashMoveNode } from '@/utils/chess/pgn-parser';
import logger from '@/utils/logger';

const debug = NODE_ENV === "development";
const hintDelay = 500;
const computerMoveDelay = 300; // length of time between computer moves when skipping to first branch

function ChessApp() {
  // Store
  const pgn: StoredPgn | null = useStore($pgn);
  const numMovesToFirstBranch = useStore($numMovesToFirstBranch);
  
  if (!pgn) return <div>Loading...</div>;

  // Game settings
  const { isSkipping, setIsSkipping } = useSkipping(pgn);
  const { isPlayingWhite, setIsPlayingWhite } = usePlayingColor(pgn);
  const [editDialogOpen, setEditDialogOpen]: [boolean, any] = useState(false);
  
  // Game engine
  const chessRef: MutableRefObject<Chess> = useRef(new Chess());
  
  // Game logic
  
  const [currentNode, setCurrentNode] = useState<MoveNode>(() => 
    mainlinesToMoveTree(moveTextToMainlines(pgn.moveText))
  );
  const currentNodeRef = useRef(currentNode);
  useEffect(() => {
    currentNodeRef.current = currentNode;
  }, [currentNode]);
  const [currentFen, setCurrentFen] = useState(currentNode.fen);
  const sentinalNode = currentNode;
  const [currentLine, setCurrentLine] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);

  // Make move with fen; returns whether move is valid
  const makeMoveByFen = useCallback((fen: string): boolean => {
    const node = currentNodeRef.current.children.find((child) => child.fen === fen);
    if (node) {
      setCurrentNode(node);
      setCurrentFen(fen);
      if (currentLineIdx + 1 >= currentLine.length) {
        setCurrentLine(node.children.map((child) => child.move));
      }
      setCurrentLineIdx(currentLineIdx + 1);
      return true;
    }
    return false;
  }, [currentLine, currentLineIdx]);

  // Hint: Returns whether there was a valid hint to give
  const hintByFen = useCallback((fen: string): boolean => {
    const node = currentNodeRef.current.children.find((child) => child.fen === fen);
    if (node) {
      const originalNode = currentNodeRef.current;
      setCurrentFen(node.fen);
      setTimeout(() => {
        setCurrentFen(originalNode.fen);
      }, hintDelay);
      return true;
    }
    return false;
  }, []);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' && currentLineIdx + 1 < currentLine.length) {
      const success = makeMoveByFen(currentLine[currentLineIdx + 1]);
      if (success) {
        setCurrentLineIdx(currentLineIdx + 1);
      }
    } else if (event.key === 'ArrowLeft' && currentLineIdx >= 0) {
      setCurrentFen(currentNodeRef.current.parent!.fen);
      setCurrentNode(currentNodeRef.current.parent!);
      setCurrentLineIdx(currentLineIdx - 1);
    }
  };

  const getHint = () => {
    if (!currentNodeRef.current.children.length) return;
    const hintFen = currentNodeRef.current.children[0].fen;
    hintByFen(hintFen);
  };

  const isUsersTurn = useCallback(() => {
    let justPlayedMove = currentNodeRef.current.isWhite === isPlayingWhite;
    logger.error('currentNode', currentNodeRef.current);
    console.log('[isUsersTurn] justPlayedMove', justPlayedMove, 'currentNode', currentNodeRef.current);
    return !justPlayedMove;
  }, [isPlayingWhite]);

  // Plays computer move if one is available
  const playComputerMove = useCallback(() => {
    console.log('[playComputerMove]');
    if (!currentNodeRef.current.children.length) return;
    const nextFen = currentNodeRef.current.children[0].fen;
    makeMoveByFen(nextFen);
  }, [makeMoveByFen]);

  const playComputerMoveIfComputersTurn = useCallback(() => {
    console.log('[playComputerMoveIfComputersTurn] isUsersTurn', isUsersTurn());
    setTimeout(() => {
      console.log('[playComputerMoveIfComputersTurn] isUsersTurn', isUsersTurn());
    }, 1000);
    if (!isUsersTurn()) {
      playComputerMove();
    }
  }, [isUsersTurn, playComputerMove]);

  const loadNextGameOrEndScreen = useCallback(() => {
    if (currentNodeRef.current.children.every((child) => pgn.gameProgress.visitedNodeHashes.includes(hashMoveNode(child)))) {
      toast.success('You win!');
      setGameOver(true);
    } else {
      setCurrentNode(sentinalNode);
      setCurrentFen(sentinalNode.fen);
      setCurrentLine([]);
      setCurrentLineIdx(-1);
    }
  }, [pgn.gameProgress.visitedNodeHashes, sentinalNode]);

  const skipToFirstBranch = useCallback(() => {
    if (isSkipping) {
      for (let i = 0; i < numMovesToFirstBranch; i++) {
        setTimeout(() => {
          playComputerMove();
        }, computerMoveDelay * (i + 1));
      }
    }
    if (currentNodeRef.current.children.length > 0) {
      let isWhitesTurn = !currentNodeRef.current.isWhite;
      if (isWhitesTurn != isPlayingWhite) {
        playComputerMove();
      }
    }
  }, [isPlayingWhite, isSkipping, numMovesToFirstBranch, playComputerMove]);

  useEffect(() => {
    logger.error('-------- [useEffect] currentNode', currentNodeRef.current);
  }, [currentNodeRef.current]);

  // Returns whether the drop was valid, and makes the move
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    console.log('[onDrop] sourceSquare', sourceSquare, 'targetSquare', targetSquare);
    const chess = chessRef.current;

    // Check if the move is valid
    const moveAttempt: Move | null = chess.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (moveAttempt && currentNodeRef.current.children.find((child) => child.fen === chess.fen())) {
      // Make the move
      setCurrentFen(chess.fen());
      setCurrentNode(currentNodeRef.current.children.find((child) => child.fen === chess.fen()));
      
      playComputerMoveIfComputersTurn();
      if (currentNodeRef.current.children.length === 0) {
        loadNextGameOrEndScreen();
      }
    } else {
      // Make & undo the move
      setCurrentFen(chess.fen());
      setTimeout(() => {
        chess.undo();
        setCurrentFen(chess.fen());
        }, 100);
    }

    return true; // does this need to return anything?
  };

  // Handle keyboard events
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <div className={cn(
        "w-full h-[100vh] flex justify-center items-center gap-4"
      )}>
        {/* Board */}
        <div style={{ width: 'min(80vh, 70vw)' }}>
          <Board
            currFen={currentNode.fen} 
            onPieceDrop={onDrop}
            isWhite={isPlayingWhite}
          />
        </div>

        {/* Aside */}
        <div className={cn(
          "flex flex-col items-center justify-center gap-2",
          debug && "border border-red-500"
        )} style={{ width: 'min(30vw, 400px)', height: 'min(80vh, 70vw)' }}>
          
          {/* Title Notes Pgn */}
          <div className={cn(
            "flex-grow flex flex-col h-full items-center w-full gap-3 p-3 pt-0",
            debug && "border border-blue-500"
          )}>
            <div className="flex flex-row items-center w-full gap-4 justify-left">
              <h3 className="text-2xl">{pgn?.title}</h3>
              <button onClick={() => setEditDialogOpen(true)}>
                <i className="fa-regular fa-pen-to-square"></i>
              </button>
            </div>
            <textarea
              value={pgn?.notes || ''}
              className="w-full p-2 border border-gray-300 rounded h-fit"
              placeholder="Type here..."
            />
            <textarea 
              value={pgn?.moveText || ''}
              className="flex-grow w-full h-full p-2 border border-gray-300 rounded"
              placeholder="Type here..."
            />
          </div>
          
          {/* Game Settings */}
          <div className="flex flex-row items-center justify-center gap-2">
            Play as:
            <button 
              className={`w-[25px] h-[25px] bg-[var(--board-light)] rounded-md ${isPlayingWhite ? 'border-2 border-[#827662]' : ''} box-border`} 
              onClick={() => setIsPlayingWhite(true)}
            ></button>
            <button 
              className={`w-[25px] h-[25px] bg-[var(--board-dark)] rounded-md ${!isPlayingWhite ? 'border-2 border-[#827662]' : ''} box-border`} 
              onClick={() => setIsPlayingWhite(false)}
            ></button>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
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

          {/* Hint Button */}
          <button 
            className="w-full p-2 border border-gray-300 rounded hover:bg-gray-100"
            onClick={getHint}
          >
            Hint
          </button>
        </div>
      </div>
      {pgn && (
        <EditPgnDialog pgn={pgn} open={editDialogOpen} setEditDialogOpen={setEditDialogOpen} />
      )}
    </>
  );
}

export default ChessApp;
