import { persistentMap } from "@nanostores/persistent";
import { StoredUser } from "@/lib/types";

const defaultUser: StoredUser = {
  _id: "",
  username: "",
  email: "",
  passwordHash: "",
  createdAt: "",
};

export const $user = persistentMap("user:", defaultUser);
export const setUser = (user: StoredUser) => {
  $user.set(user);
};
export const clearUser = () => {
  $user.set(defaultUser);
};