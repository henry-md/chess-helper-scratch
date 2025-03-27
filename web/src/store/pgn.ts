import { persistentMap } from "@nanostores/persistent";
import { PgnType } from "@/lib/types";
import { atom } from "nanostores";

const defaultPgns: PgnType[] = [];

export const $pgns = persistentMap<PgnType[]>("pgns:", defaultPgns, {
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
  $pgns.set(
    $pgns.get().map((pgnObj) => {
      if (pgnObj._id === pgnId) {
        return { ...pgnObj, title, pgn, notes };
      }
      return pgnObj;
    })
  );
};
export const clearPgns = () => {
  $pgns.set(defaultPgns);
};

// Refresh
export const $refreshPgnsTrigger = atom(0);
export const triggerPgnsRefresh = () => {
  $refreshPgnsTrigger.set($refreshPgnsTrigger.get() + 1);
};