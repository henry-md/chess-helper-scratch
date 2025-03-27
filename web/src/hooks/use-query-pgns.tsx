import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  setPgns,
  $pgns,
  $refreshPgnsTrigger,
} from "@/store/pgn";
import { API_URL } from "@/env";
import { toast } from "react-toastify";
import { getAuthHeader } from "@/utils/auth";

function useQueryPgns() {
  const pgns = useStore($pgns);
  const refreshTrigger = useStore($refreshPgnsTrigger);

  const loadPgns = async () => {
    try {
      // Get search params and do stuff (later)
      // const searchParams = new URLSearchParams(window.location.search);

      const response = await fetch(`${API_URL}/pgns`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      const { pgns } = await response.json();
      setPgns(pgns);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast.error(`Error reading PGNs: ${errorMessage}`);
    }
  };

  useEffect(() => {
    loadPgns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search, refreshTrigger]);

  return { pgns };
}

export default useQueryPgns;
