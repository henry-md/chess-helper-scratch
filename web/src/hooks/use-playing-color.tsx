import { IPgnDocument } from "@/lib/types";
import { useState } from "react";

const usePlayingColor = (pgn: IPgnDocument) => {
  const [isPlayingWhite, setIsPlayingWhite] = useState<boolean>(pgn.isPlayingWhite);

  return { isPlayingWhite, setIsPlayingWhite };
};

export default usePlayingColor;