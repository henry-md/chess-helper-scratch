import { StoredPgn } from "@/lib/types";
import { $isPlayingWhite, setIsPlayingWhiteStore } from "@/store/chess-settings";
import { getAuthHeader } from "@/utils/auth";
import { useStore } from "@nanostores/react";
import { toast } from "react-toastify";
import { API_URL } from "@/env";

const usePlayingColor = (pgn: StoredPgn) => {
  const isPlayingWhite = useStore($isPlayingWhite)

  const setIsPlayingWhite = async (value: boolean) => {
    // Call API
    const body = {
      gameSettings: {
        isPlayingWhite: value
      }
    };
    const response = await fetch(`${API_URL}/pgn/${pgn._id}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      toast.error("Error updating PGN");
      return;
    }

    // Update store
    setIsPlayingWhiteStore(value)
  }

  return { isPlayingWhite, setIsPlayingWhite }
};

export default usePlayingColor;
