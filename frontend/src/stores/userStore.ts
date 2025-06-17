import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { UserState } from "./interfaces";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'user-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
