import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import ChessApp from "../components/chess-app";
import { useStore } from "@nanostores/react";
import { $pgnDict } from "../store/pgn";
import { setMainlines, setNumMovesToFirstBranch } from "../store/game-core";
import { API_URL } from "@/env";
import { getAuthHeader } from "@/utils/auth";
import { findNumMovesToFirstBranch, pgnToMainlines } from "@/utils/chess/pgn-parser";
import { setCurrentPgnId } from "../store/game-core";

const Game = () => {
  const { id } = useParams();
  const pgnDict = useStore($pgnDict);
  const currentPgnObject = pgnDict && id ? pgnDict[id] : undefined;

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
        setMainlines(pgnToMainlines(pgn.moveText));
        setNumMovesToFirstBranch(findNumMovesToFirstBranch(pgn.moveText));
      }
    };

    fetchPgn();
    
    // Cleanup when unmounting
    return () => {
      setMainlines([]);
      setNumMovesToFirstBranch(0);
    };
  }, [id]);

  if (!pgnDict || !currentPgnObject) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <ChessApp />
    </>
  );
};

export default Game;