import { persistentMap } from "@nanostores/persistent";
import { persistentAtom } from "@nanostores/persistent";

const defaultUser = {
  _id: "",
  username: "",
  email: "",
  passwordHash: "",
};

export const $user = persistentMap("user:", defaultUser);
export const $isAuthenticated = persistentAtom<boolean>("auth:", false, {
  encode: (value) => String(value),
  decode: (value) => value === "true"
});

export const setUser = (user: any) => {
  $user.set(user);
};

export const clearUser = () => {
  $user.set(defaultUser);
};

export const setIsAuthenticated = (value: boolean) => {
  $isAuthenticated.set(value);
};
