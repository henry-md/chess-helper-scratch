import { persistentAtom } from '@nanostores/persistent'
import { PgnType } from "@/lib/types";
import { updatePgn } from "./pgn";
import logger from '@/utils/logger';

export const $currentPgnObject = persistentAtom<PgnType | null>('current-pgn-object', null, {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
});

export const $numMovesToFirstBranch = persistentAtom<number>('num-moves-to-first-branch', 0, {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
});

export const setCurrentPgnObject = (pgn: PgnType | null) => {
  logger.info('[chess-app.ts nano] Setting current PGN object:', pgn);
  // If pgn is not null, create a new object reference to trigger a re-render
  const newPgn = pgn ? {...pgn} : null;
  $currentPgnObject.set(newPgn);
};

export const updateCurrentPgn = async (pgnId: string, title: string, pgn: string, notes: string) => {
  // Update in database
  const response = await fetch(`/api/pgn/${pgnId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, pgn, notes }),
  });
  
  if (response.ok) {
    const { pgn: updatedPgn } = await response.json();
    // Update both stores
    setCurrentPgnObject(updatedPgn);
    updatePgn(pgnId, title, pgn, notes);
    return true;
  }
  return false;
};


export const $mainlines = persistentAtom<string[]>('chess-mainlines:', [], {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
})

export const setMainlines = (value: string[]) => {
  $mainlines.set(value)
}

export const setNumMovesToFirstBranch = (value: number) => {
  $numMovesToFirstBranch.set(value)
}
