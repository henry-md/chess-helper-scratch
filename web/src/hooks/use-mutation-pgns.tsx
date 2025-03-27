import { API_URL } from "@/env";
import { toast } from "react-toastify";
import { addPgn, updatePgn, triggerPgnsRefresh } from "@/store/pgn";
import { getAuthHeader } from "@/utils/auth";
import logger from "@/utils/logger";

function useMutationPgns() {
  const createPgn = async (title: string, pgn: string, notes: string = "", isPublic: boolean = false) => {
    try {
      const response = await fetch(`${API_URL}/pgns`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json"
        },
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
    logger.debug(`[useMutationPgns] Updating PGN ${pgnId} with ${JSON.stringify(updates)}`);
    try {
      const response = await fetch(`${API_URL}/pgn/${pgnId}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json"
        },
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
      triggerPgnsRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting PGN");
    }
  }

  return { createPgn, updatePgnContent, deletePgn };
}

export default useMutationPgns;