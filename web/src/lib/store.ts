import { persistentMap } from "@nanostores/persistent";
import { UserType, PgnType } from "@/lib/types";

// Default objects for deletion
const defaultUser = {
  _id: "",
  username: "",
  email: "",
  passwordHash: "",
  createdAt: "",
};
const defaultPgns: PgnType[] = [];

// User store
export const $user = persistentMap("user:", defaultUser);
export const setUser = (user: UserType) => {
  $user.set(user);
};
export const clearUser = () => {
  $user.set(defaultUser);
};

// PGN store
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