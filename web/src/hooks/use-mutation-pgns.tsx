import { API_URL } from "@/env";
import { toast } from "react-toastify";
import { addPgnDict, updatePgnDict, deletePgnFromDict, $pgnDict } from "@/store/pgn";
import { getAuthHeader } from "@/utils/auth";
import logger from "@/utils/logger";
import { formatError } from "@/utils/error";

function useMutationPgns() {
  const createPgn = async ({
    title,
    pgn,
    notes = "",
    isPublic = false 
  }: {
    title: string;
    pgn: string;
    notes?: string;
    isPublic?: boolean;
  }) => {
    try {
      const response = await fetch(`${API_URL}/pgn`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, pgn, notes, isPublic }),
      });
      
      logger.debug(`[useMutationPgns] Creating PGN "${title}" with pgn "${pgn}" and notes "${notes}" and isPublic "${isPublic}"; response: ${JSON.stringify(response)}`);
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(formatError(data));
        return undefined;
      } else {
        addPgnDict(data.pgn);
        // triggerPgnsRefresh();
        return data.pgn;
      }
    } catch (error) {
      toast.error("Error adding PGN");
      return undefined;
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
      updatePgnDict(pgnId, updatedPgn.title, updatedPgn.pgn, updatedPgn.notes);
      // triggerPgnsRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error updating PGN");
    }
  }

  const deletePgn = async (pgnId: string) => {
    // Get current state before deletion for potential rollback
    const currentState = $pgnDict.get();
    
    try {
      // Optimistically remove from local state
      deletePgnFromDict(pgnId);

      // Make the API call
      const response = await fetch(`${API_URL}/pgn/${pgnId}`, { 
        method: "DELETE", 
        headers: getAuthHeader(),
      });
      
      // Rollback state on server error
      if (!response.ok) {
        $pgnDict.set(currentState);
        toast.error(`Error deleting PGN: ${response.statusText}`);
      }
    } catch (error) {
      // Rollback state on network error
      $pgnDict.set(currentState);
      toast.error(`Error deleting PGN: ${error}`);
    }
  }

  return { createPgn, updatePgnContent, deletePgn };
}

export default useMutationPgns;