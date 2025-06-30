import { useQuery } from "@tanstack/react-query";
import { getPublicRecipes } from "@/services/generateService";
import  { getMyRecipes } from "@/services/generateService";

export const usePublicRecipesQuery = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: () => getPublicRecipes(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useMyRecipesQuery = () => {
  return useQuery({
    queryKey: ["my-recipes"],
    queryFn: () => getMyRecipes(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};