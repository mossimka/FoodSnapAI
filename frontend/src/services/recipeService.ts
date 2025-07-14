import axios from '@/lib/axios';
import { AxiosError } from 'axios';
import { tokenService } from './tokenService';
import { IRecipe, RecipePatchRequest, PaginatedRecipesResponse, SortOrder } from "@/interfaces/recipe";

// Paginated functions
export async function getPublicRecipesPaginated(page: number = 1, pageSize: number = 20, sortBy: SortOrder = SortOrder.NEWEST): Promise<PaginatedRecipesResponse> {
  const response = await axios.get(`/dish/public/?page=${page}&page_size=${pageSize}&sort_by=${sortBy}`, {
    headers: {
      ...tokenService.getAuthHeader(),
    },
  });
  return response.data;
}

export async function getMyRecipesPaginated(page: number = 1, pageSize: number = 20, sortBy: SortOrder = SortOrder.NEWEST): Promise<PaginatedRecipesResponse> {
  const response = await axios.get(`/dish/my/?page=${page}&page_size=${pageSize}&sort_by=${sortBy}`, {
    headers: {
      ...tokenService.getAuthHeader(),
    },
  });
  return response.data;
}

export async function getAllRecipesPaginated(page: number = 1, pageSize: number = 20, sortBy: SortOrder = SortOrder.NEWEST): Promise<PaginatedRecipesResponse> {
  const response = await axios.get(`/dish/?page=${page}&page_size=${pageSize}&sort_by=${sortBy}`, {
    headers: {
      ...tokenService.getAuthHeader(),
    },
  });
  return response.data;
}

// Non-paginated functions (for backward compatibility)
export async function getPublicRecipes(): Promise<IRecipe[]> {
  const response = await getPublicRecipesPaginated(1, 100);
  return response.recipes;
}

export async function getMyRecipes(): Promise<IRecipe[]> {
  const response = await getMyRecipesPaginated(1, 100);
  return response.recipes;
}

// Single recipe operations
export async function getRecipeBySlug(slug: string): Promise<IRecipe> {
  const response = await axios.get(`/dish/recipes/${slug}/`, {
    headers: {
      ...tokenService.getAuthHeader(),
    },
  });
  return response.data;
}

export async function patchRecipe(recipeId: number, data: RecipePatchRequest) {
  const response = await axios.patch(`/dish/patch/${recipeId}`, data, {
    headers: {
      ...tokenService.getAuthHeader(),
    },
  });
  return response.data;
}

export async function deleteRecipe(recipeId: number): Promise<void> {
  const token = tokenService.requireAuth();

  try {
    await axios.delete(`/dish/${recipeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: unknown) {
    const err = error as AxiosError<{ detail: string }>;
    throw new Error(err.response?.data?.detail || "Failed to delete recipe");
  }
}