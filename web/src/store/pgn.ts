import { persistentAtom } from "@nanostores/persistent";
import { PgnType } from "@/lib/types";
import { atom } from "nanostores";
import logger from "@/utils/logger";

const defaultPgns: PgnType[] = [];

export const $pgns = persistentAtom<PgnType[]>("pgns:", defaultPgns, {
  encode: JSON.stringify,
  decode: JSON.parse
});
export const setPgns = (pgns: PgnType[]) => {
  $pgns.set(pgns);
};
export const addPgn = (pgn: PgnType) => {
  $pgns.set([...$pgns.get(), pgn]);
};
export const updatePgn = (pgnId: string, title: string, pgn: string, notes: string) => {
  logger.info('[pgn.ts nano] Updating PGN:', pgnId, title, pgn, notes);
  const currentPgns = $pgns.get();
  const updatedPgns = currentPgns.map((pgnObj) => {
    if (pgnObj._id === pgnId) {
      return { ...pgnObj, title, pgn, notes };
    }
    return pgnObj;
  });
  $pgns.set(updatedPgns);
};
export const clearPgns = () => {
  $pgns.set(defaultPgns);
};

// Refresh
export const $refreshPgnsTrigger = atom(0);
export const triggerPgnsRefresh = () => {
  $refreshPgnsTrigger.set($refreshPgnsTrigger.get() + 1);
};