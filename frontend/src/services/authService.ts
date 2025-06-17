import axios from '@/lib/axios';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

interface SignUpInput {
  username: string;
  email: string;
  password: string;
}

interface SignInInput {
  username: string;
  password: string;
}

export async function signUp(data: SignUpInput) {
  try {
    const response = await axios.post('/auth/', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ detail: string }>;
    throw new Error(err.response?.data?.detail || 'Sign up failed');
  }
}


export async function signIn({ username, password }: SignInInput) {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const token = response.data.access_token;

    useAuthStore.getState().login(token);

    const profileResponse = await axios.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetched user:", profileResponse.data); 
    useUserStore.getState().setUser(profileResponse.data);

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ detail: string }>;
    throw new Error(err.response?.data?.detail || 'Sign in failed');
  }
}

export function logout() {
  useAuthStore.getState().logout();
  localStorage.removeItem('access_token');
}
