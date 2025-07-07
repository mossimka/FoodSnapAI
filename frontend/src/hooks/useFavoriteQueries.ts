import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { 
  checkFavoriteStatus, 
  addToFavorites, 
  removeFromFavorites 
} from "@/services/favoriteService";

export const useFavoriteStatusQuery = (recipeId: number) => {
  return useQuery({
    queryKey: ["favorite", "status", recipeId],
    queryFn: () => checkFavoriteStatus(recipeId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!recipeId,
  });
};

export const useAddToFavoritesMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipeId: number) => addToFavorites(recipeId),
    
    onSuccess: (data) => {
      toast.success("Recipe added to favorites!");
      
      // Invalidate favorite status for this recipe
      queryClient.invalidateQueries({ 
        queryKey: ["favorite", "status", data.recipe_id] 
      });
      
      // Invalidate favorites list
      queryClient.invalidateQueries({ 
        queryKey: ["recipes", "favorites"] 
      });
    },
    
    onError: (error: Error) => {
      toast.error("Failed to add to favorites: " + error.message);
    },
  });
};

export const useRemoveFromFavoritesMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipeId: number) => removeFromFavorites(recipeId),
    
    onSuccess: (data) => {
      toast.success("Recipe removed from favorites!");
      
      // Invalidate favorite status for this recipe
      queryClient.invalidateQueries({ 
        queryKey: ["favorite", "status", data.recipe_id] 
      });
      
      // Invalidate favorites list
      queryClient.invalidateQueries({ 
        queryKey: ["recipes", "favorites"] 
      });
    },
    
    onError: (error: Error) => {
      toast.error("Failed to remove from favorites: " + error.message);
    },
  });
};