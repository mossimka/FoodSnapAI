import { useAuthStore } from '@/stores/authStore';
import axios from '@/lib/axios';

class TokenService {
  getAccessToken(): string | null {
    return useAuthStore.getState().token;
  }

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated && !!this.getAccessToken();
  }

  getAuthHeader(): { Authorization: string } | Record<string, never> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async initializeAuth(): Promise<boolean> {
    try {
      if (this.isAuthenticated()) {
        return true;
      }
      if (useAuthStore.getState().isAuthenticated) {
        const response = await axios.post('/auth/refresh', null, { 
          withCredentials: true 
        });
        const token = response.data.access_token;
        useAuthStore.getState().login(token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Auth initialization failed:', error);
      useAuthStore.getState().logout();
      return false;
    }
  }

  requireAuth(): string {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    return token;
  }
}

export const tokenService = new TokenService(); 