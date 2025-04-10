import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  setPgnDict,
  $pgnDict,
} from "@/store/pgn";
import { API_URL } from "@/env";
import { toast } from "react-toastify";
import { getAuthHeader } from "@/utils/auth";
import logger from "@/utils/logger";

function useQueryPgns() {
  const pgnDict = useStore($pgnDict);
  const [isLoading, setIsLoading] = useState(true);

  const loadPgns = async () => {
    try {
      // Get search params and do stuff (later)
      // const searchParams = new URLSearchParams(window.location.search);

      const response = await fetch(`${API_URL}/pgns`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      const { pgns: pgnsArray } = await response.json();
      logger.debug('[useQueryPgns] Fetched PGNs:', pgnsArray);
      setPgnDict(pgnsArray);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast.error(`Error reading PGNs: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    logger.debug('[useQueryPgns] Starting load, setting loading state');
    setIsLoading(true);
    loadPgns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]); // refreshTrigger

  // Convert back to array for components that need it
  const pgnArray = Object.values(pgnDict);
  return { pgnArray, isLoading };
}

export default useQueryPgns;
