import { persistentAtom } from "@nanostores/persistent";
import { IPgnDocument, StoredPgn } from "@/lib/types";
import logger from "@/utils/logger";
import { serializePgn } from "@/lib/serializers";

// SHOULDN'T NEED ANY OF THIS EVENTUALLY
const defaultPgnDict: Record<string, StoredPgn> = {};

export const $pgnDict = persistentAtom<Record<string, StoredPgn>>("pgns:", defaultPgnDict, {
  encode: JSON.stringify,
  decode: JSON.parse
});

export const setPgnDict = (pgns: StoredPgn[]) => {
  // Convert array to dictionary
  const pgnDict = pgns.reduce((acc, pgn) => {
    acc[pgn._id] = pgn;
    return acc;
  }, {} as Record<string, StoredPgn>);
  $pgnDict.set(pgnDict);
};

export const addPgnDict = (pgn: StoredPgn) => {
  $pgnDict.set({ ...$pgnDict.get(), [pgn._id]: pgn });
};

export const updatePgnDict = (pgn: StoredPgn) => {
  logger.info('[pgn.ts nano] Updating PGN:', pgn);
  if ($pgnDict.get()[pgn._id]) {
    $pgnDict.set({ ...$pgnDict.get(), [pgn._id]: pgn });
  }
};

export const clearPgnDict = () => {
  $pgnDict.set(defaultPgnDict);
};

export const deletePgnFromDict = (pgnId: string) => {
  const currentPgns = $pgnDict.get();
  const newState = { ...currentPgns };
  delete newState[pgnId];
  $pgnDict.set(newState);
};

export const $currentPgn = persistentAtom<StoredPgn | null>("currentPgn", null, {
  encode: JSON.stringify,
  decode: JSON.parse
});

export const setCurrentPgn = (pgn: StoredPgn) => {
  $currentPgn.set(pgn);
};

export const clearCurrentPgn = () => {
  $currentPgn.set(null);
};
