import { useQuery } from "@tanstack/react-query";
import { getMyRecipesPaginated, getPublicRecipesPaginated } from "@/services/recipeService";
import { getFavoriteRecipesPaginated } from "@/services/favoriteService";
import { SortOrder } from "@/interfaces/recipe";

export const usePublicRecipesQuery = (page: number = 1, pageSize: number = 20, sortBy: SortOrder = SortOrder.NEWEST) => {
  return useQuery({
    queryKey: ["recipes", "public", page, pageSize, sortBy],
    queryFn: () => getPublicRecipesPaginated(page, pageSize, sortBy),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useMyRecipesQuery = (page: number = 1, pageSize: number = 20, sortBy: SortOrder = SortOrder.NEWEST) => {
  return useQuery({
    queryKey: ["recipes", "my", page, pageSize, sortBy],
    queryFn: () => getMyRecipesPaginated(page, pageSize, sortBy),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useFavoriteRecipesQuery = (page: number = 1, pageSize: number = 20, sortBy: SortOrder = SortOrder.NEWEST) => {
  return useQuery({
    queryKey: ["recipes", "favorites", page, pageSize, sortBy],
    queryFn: () => getFavoriteRecipesPaginated(page, pageSize, sortBy),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};