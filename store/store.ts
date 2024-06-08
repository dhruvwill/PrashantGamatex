import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  username: string;
  password: string;
};
type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
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
      }),
      {
        name: "userStore",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

export { useUserStore, useThemeStore, User };
