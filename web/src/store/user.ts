import { persistentMap } from "@nanostores/persistent";
import { UserType } from "@/lib/types";

// Default objects for deletion
const defaultUser = {
  _id: "",
  username: "",
  email: "",
  passwordHash: "",
  createdAt: "",
};

export const $user = persistentMap("user:", defaultUser);
export const setUser = (user: UserType) => {
  $user.set(user);
};
export const clearUser = () => {
  $user.set(defaultUser);
};