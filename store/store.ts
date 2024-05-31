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

export { useUserStore, User };
