import { persistentAtom } from "@nanostores/persistent";
import { PgnType } from "@/lib/types";
import { atom } from "nanostores";
import logger from "@/utils/logger";

const defaultPgns: Record<string, PgnType> = {};

export const $pgnDict = persistentAtom<Record<string, PgnType>>("pgns:", defaultPgns, {
  encode: JSON.stringify,
  decode: JSON.parse
});

export const setPgnDict = (pgns: PgnType[]) => {
  // Convert array to dictionary
  const pgnDict = pgns.reduce((acc, pgn) => {
    acc[pgn._id] = pgn;
    return acc;
  }, {} as Record<string, PgnType>);
  $pgnDict.set(pgnDict);
};

export const addPgnDict = (pgn: PgnType) => {
  const currentPgns = $pgnDict.get();
  $pgnDict.set({ ...currentPgns, [pgn._id]: pgn });
};

export const updatePgnDict = (pgn: PgnType) => {
  logger.info('[pgn.ts nano] Updating PGN:', pgn._id, pgn.title, pgn.moveText, pgn.notes);
  if ($pgnDict.get()[pgn._id]) {
    $pgnDict.set({ ...$pgnDict.get(), [pgn._id]: pgn });
  }
};

export const clearPgnDict = () => {
  $pgnDict.set(defaultPgns);
};

export const deletePgnFromDict = (pgnId: string) => {
  const currentPgns = $pgnDict.get();
  const newState = { ...currentPgns };
  delete newState[pgnId];
  $pgnDict.set(newState);
};
