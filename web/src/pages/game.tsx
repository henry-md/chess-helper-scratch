import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import ChessApp from "../components/chess-app";
import { useStore } from "@nanostores/react";
import { $currentPgnObject, setCurrentPgnObject, setMainlines, setNumMovesToFirstBranch } from "../store/chess-app";
import { API_URL } from "@/env";
import { getAuthHeader } from "@/utils/auth";
import { findNumMovesToFirstBranch, pgnToMainlines } from "@/utils/chess/pgn-parser";

const Game = () => {
  const { id } = useParams();
  const currentPgn = useStore($currentPgnObject);

  useEffect(() => {
    const fetchPgn = async () => {
      if (!id) return;
      
      const response = await fetch(`${API_URL}/pgn/${id}`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      if (response.ok) {
        const { pgn } = await response.json();
        console.log('pgn', pgn);
        console.log('pgn.pgn', pgn.pgn);
        setCurrentPgnObject(pgn);
        setMainlines(pgnToMainlines(pgn.pgn));
        setNumMovesToFirstBranch(findNumMovesToFirstBranch(pgn.pgn));
      }
    };

    fetchPgn();
    
    // Cleanup when unmounting
    return () => setCurrentPgnObject(null);
  }, [id]);

  if (!currentPgn) {
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