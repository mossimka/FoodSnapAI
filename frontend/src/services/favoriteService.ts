import axios from '@/lib/axios';
import { AxiosError } from 'axios';
import { tokenService } from './tokenService';
import { 
  PaginatedFavoriteRecipesResponse, 
  FavoriteStatusResponse,
  SortOrder
} from "@/interfaces/recipe";

// Paginated favorites
export async function getFavoriteRecipesPaginated(page: number = 1, pageSize: number = 20, sortBy: SortOrder = SortOrder.NEWEST): Promise<PaginatedFavoriteRecipesResponse> {
  const response = await axios.get(`/dish/favorites/?page=${page}&page_size=${pageSize}&sort_by=${sortBy}`, {
    headers: {
      ...tokenService.getAuthHeader(),
    },
  });
  return response.data;
}

// Add to favorites
export async function addToFavorites(recipeId: number): Promise<FavoriteStatusResponse> {
  const token = tokenService.requireAuth();

  try {
    const response = await axios.post(`/dish/favorites/${recipeId}/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ detail: string }>;
    throw new Error(err.response?.data?.detail || "Failed to add to favorites");
  }
}

// Remove from favorites
export async function removeFromFavorites(recipeId: number): Promise<FavoriteStatusResponse> {
  const token = tokenService.requireAuth();

  try {
    const response = await axios.delete(`/dish/favorites/${recipeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ detail: string }>;
    throw new Error(err.response?.data?.detail || "Failed to remove from favorites");
  }
}

// Check favorite status
export async function checkFavoriteStatus(recipeId: number): Promise<FavoriteStatusResponse> {
  const response = await axios.get(`/dish/favorites/check/${recipeId}/`, {
    headers: {
      ...tokenService.getAuthHeader(),
    },
  });
  return response.data;
}

// Get favorites count (utility function)
export async function getFavoritesCount(): Promise<number> {
  try {
    const response = await getFavoriteRecipesPaginated(1, 1);
    return response.total;
  } catch (error) {
    console.error("Failed to get favorites count:", error);
    return 0;
  }
}
