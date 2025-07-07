"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { 
  useFavoriteStatusQuery, 
  useAddToFavoritesMutation, 
  useRemoveFromFavoritesMutation 
} from "@/hooks/useFavoriteQueries";
import Styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  recipeId: number;
  recipeUserId: number;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  recipeId, 
  recipeUserId, 
  className 
}) => {
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();
  
  const { data: favoriteStatus, isLoading: statusLoading } = useFavoriteStatusQuery(recipeId);
  const addToFavoritesMutation = useAddToFavoritesMutation();
  const removeFromFavoritesMutation = useRemoveFromFavoritesMutation();

  const isOwner = user?.id === recipeUserId;
  const isFavorited = favoriteStatus?.is_favorited || false;
  const isProcessing = addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending;

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      return;
    }

    if (isFavorited) {
      removeFromFavoritesMutation.mutate(recipeId);
    } else {
      addToFavoritesMutation.mutate(recipeId);
    }
  };

  // Don't show button for unauthenticated users or recipe owners
  if (!isAuthenticated || isOwner) {
    return null;
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={statusLoading || isProcessing}
      className={`${Styles.favoriteButton} ${isFavorited ? Styles.favorited : ''} ${className || ''}`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        size={20} 
        className={`${Styles.heartIcon} ${isFavorited ? Styles.filled : ''}`}
      />
      {isProcessing ? (
        <span className={Styles.buttonText}>
          {isFavorited ? "Removing..." : "Adding..."}
        </span>
      ) : (
        <span className={Styles.buttonText}>
          {isFavorited ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}; 