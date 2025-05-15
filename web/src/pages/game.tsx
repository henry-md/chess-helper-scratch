import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import ChessApp from "../components/chess-app";
import { useStore } from "@nanostores/react";
import { $pgnDict } from "../store/pgn";
import { setMainlines, setNumMovesToFirstBranch } from "../store/game-core";
import { API_URL } from "@/env";
import { getAuthHeader } from "@/utils/auth";
import { findNumMovesToFirstBranch, moveTextToMainlines } from "@/utils/chess/pgn-parser";
import { setCurrentPgnId } from "../store/game-core";
import useSkipping from "@/hooks/game/use-skipping";
import usePlayingColor from "@/hooks/game/use-playing-color";

const Game = () => {
  const { id } = useParams();
  const pgnDict = useStore($pgnDict);
  const currentPgnObject = pgnDict && id ? pgnDict[id] : undefined;
  
  // Update game state
  if (!currentPgnObject) return <div>Loading...</div>;
  const { setIsSkipping } = useSkipping(currentPgnObject);
  const { setIsPlayingWhite } = usePlayingColor(currentPgnObject);

  // Load game & game state from id
  useEffect(() => {
    const fetchPgn = async () => {
      if (!id) return;
      setCurrentPgnId(id);

      const response = await fetch(`${API_URL}/pgn/${id}`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      if (response.ok) {
        const { pgn } = await response.json();
        console.log('pgn', pgn);
        console.log('pgn.moveText', pgn.moveText);
        setMainlines(moveTextToMainlines(pgn.moveText));
        setNumMovesToFirstBranch(findNumMovesToFirstBranch(pgn.moveText));
        setIsSkipping(currentPgnObject.gameSettings.isSkipping);
        setIsPlayingWhite(currentPgnObject.gameSettings.isPlayingWhite);
      }
    };

    fetchPgn();
    
    // Cleanup when unmounting
    return () => {
      setMainlines([]);
      setNumMovesToFirstBranch(0);
    };
  }, [id]);

  if (!pgnDict || !currentPgnObject || !id) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <ChessApp currentPgnId={id} />
    </>
  );
};

export default Game;