import { useQuery } from "@tanstack/react-query";
import { getPublicRecipes } from "@/services/generateService";

export const useRecipesQuery = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: () => getPublicRecipes(),
  });
};