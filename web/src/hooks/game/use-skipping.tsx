import { API_URL } from "@/env";
import { StoredPgn } from "@/lib/types";
import { $isSkipping, setIsSkippingStore } from "@/store/chess-settings";
import { getAuthHeader } from "@/utils/auth";
import { useStore } from "@nanostores/react";
import { toast } from "react-toastify";

const useSkipping = (pgn: StoredPgn) => {
  const isSkipping = useStore($isSkipping)

  const setIsSkipping = async (value: boolean) => {
    // Call API
    const body = {
      gameSettings: {
        isSkipping: value
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
    setIsSkippingStore(value)
  }

  return { isSkipping, setIsSkipping }
};

export default useSkipping;
