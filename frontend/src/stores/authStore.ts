import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from './interfaces';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,

      login: (token: string) => {
        set({ isAuthenticated: true, token });
      },

      logout: () => {
        set({ isAuthenticated: false, token: null });
      },
    }),
    {
      name: 'auth',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
