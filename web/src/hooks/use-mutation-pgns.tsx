import { API_URL } from "@/env";
import { toast } from "react-toastify";
import { $pgns, setPgns, addPgn, updatePgn } from "@/lib/store";
import { useStore } from "@nanostores/react";

function useMutationPgns() {
  const pgns = useStore($pgns);

  const getPgns = async () => {
    try {
      const response = await fetch(`${API_URL}/pgns`, {
        method: "GET",
        credentials: "include",
      });
      const { pgns } = await response.json();
      console.log('use-mutation-pgns hook: getPgns: pgns', pgns);
      setPgns(pgns);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching PGNs");
    }
  }

  const createPgn = async (title: string, pgn: string, notes: string) => {
    try {
      const response = await fetch(`${API_URL}/pgns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, pgn, notes }),
      });
      const { newPgn } = await response.json();
      addPgn(newPgn);
    } catch (error) {
      console.error(error);
      toast.error("Error adding PGN");
    }
  }

  const updatePgnContent = async (pgnId: string, title: string, pgn: string, notes: string) => {
    try {
      const response = await fetch(`${API_URL}/pgns/${pgnId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, pgn, notes }),
      });
      const { updatedPgn } = await response.json();
      updatePgn(pgnId, updatedPgn.title, updatedPgn.pgn, updatedPgn.notes);
    } catch (error) {
      console.error(error);
      toast.error("Error updating PGN");
    }
  }

  const deletePgn = async (pgnId: string) => {
    try {
      await fetch(`${API_URL}/pgn/${pgnId}`, { 
        method: "DELETE", 
        credentials: "include" 
      });
      deletePgn(pgnId);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting PGN");
    }
  }

  return { pgns, getPgns, createPgn, updatePgnContent, deletePgn };
}

export default useMutationPgns;