import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Timeframe } from "~/types/dashboard";

type User = {
  data: {
    uid: string;
    username: string;
    name: string;
    company: string;
  };
  token: string;
};

export type UserStore = {
  user: User | null;
  fcmToken: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  setFcmToken: (fcmToken: string) => void;
  clearFcmToken: () => void;
};

export type AppStore = {
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
};

export type ThemeStore = {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
};

const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        theme: "light",
        setTheme: (theme: any) => set({ theme }),
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
        fcmToken: null,
        setUser: (user: User) => set({ user }),
        clearUser: () => set({ user: null }),
        setToken: (token: string) =>
          set((state: any) => {
            if (state.user) {
              return { user: { ...state.user, token } };
            }
            return state;
          }),
        clearToken: () =>
          set((state: any) => {
            if (state.user) {
              return { user: { ...state.user, token: "" } };
            }
            return state;
          }),
        setFcmToken: (fcmToken: string) =>
          set((state: any) => {
            if (state.user) {
              return { user: { ...state.user, fcmToken } };
            }
            return state;
          }),
        clearFcmToken: () =>
          set((state: any) => {
            if (state.user) {
              return { user: { ...state.user, fcmToken: "" } };
            }
            return state;
          }),
      }),
      {
        name: "userStore",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

const useAppStore = create<AppStore>((set: any) => ({
  timeframe: {
    value: "1D",
    label: "1 Day",
  },
  setTimeframe: (timeframe: Timeframe) => set({ timeframe }),
}));

export { useUserStore, useThemeStore, useAppStore, User };
