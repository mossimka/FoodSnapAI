import { useQuery } from "@tanstack/react-query";
import { getMyRecipesPaginated, getPublicRecipesPaginated } from "@/services/recipeService";
import { getFavoriteRecipesPaginated } from "@/services/favoriteService";

export const usePublicRecipesQuery = (page: number = 1, pageSize: number = 20) => {
  return useQuery({
    queryKey: ["recipes", "public", page, pageSize],
    queryFn: () => getPublicRecipesPaginated(page, pageSize),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useMyRecipesQuery = (page: number = 1, pageSize: number = 20) => {
  return useQuery({
    queryKey: ["recipes", "my", page, pageSize],
    queryFn: () => getMyRecipesPaginated(page, pageSize),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useFavoriteRecipesQuery = (page: number = 1, pageSize: number = 20) => {
  return useQuery({
    queryKey: ["recipes", "favorites", page, pageSize],
    queryFn: () => getFavoriteRecipesPaginated(page, pageSize),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};