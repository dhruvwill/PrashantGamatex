import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  username: string;
  usercode: string;
  token: string;
};
type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
};

type ThemeStore = {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
};

const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        theme: "light",
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: "themeStore",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
        setToken: (token) =>
          set((state) => ({ user: { ...state.user!, token } })),
        clearToken: () =>
          set((state) => ({ user: { ...state.user!, token: "" } })),
      }),
      {
        name: "userStore",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

export { useUserStore, useThemeStore, User };
