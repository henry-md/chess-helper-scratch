import { API_URL } from "@/env";
import { toast } from "react-toastify";
import { addPgn, updatePgn, triggerPgnsRefresh } from "@/lib/store";
import { getAuthHeader } from "@/utils/auth";

function useMutationPgns() {
  const createPgn = async (title: string, pgn: string, notes: string = "", isPublic: boolean = false) => {
    try {
      const response = await fetch(`${API_URL}/pgns`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ title, pgn, notes, isPublic }),
      });
      const { newPgn } = await response.json();
      addPgn(newPgn);
      triggerPgnsRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error adding PGN");
    }
  }

  const updatePgnContent = async (
    pgnId: string,
    updates: {
      title?: string;
      pgn?: string;
      notes?: string;
      isPublic?: boolean;
    }
  ) => {
    try {
      const response = await fetch(`${API_URL}/pgn/${pgnId}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify(updates),
      });
      const { pgn: updatedPgn } = await response.json();
      updatePgn(pgnId, updatedPgn.title, updatedPgn.pgn, updatedPgn.notes);
      triggerPgnsRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error updating PGN");
    }
  }

  const deletePgn = async (pgnId: string) => {
    try {
      await fetch(`${API_URL}/pgn/${pgnId}`, { 
        method: "DELETE", 
        headers: getAuthHeader(),
      });
      // deletePgn(pgnId);
      triggerPgnsRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting PGN");
    }
  }

  return { createPgn, updatePgnContent, deletePgn };
}

export default useMutationPgns;