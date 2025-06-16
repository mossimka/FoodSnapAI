import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from './interfaces';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,

      login: (token: string) => {
        localStorage.setItem('access_token', token);
        set({ isAuthenticated: true, token });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ isAuthenticated: false, token: null });
      },
    }),
    {
      name: 'auth',
    }
  )
);
