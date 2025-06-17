export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}


export interface User {
  id: number;
  username: string;
  email: string;
  profile_pic: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
}