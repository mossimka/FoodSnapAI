"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";

import Styles from "./RecipePopup.module.css";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { IRecipe } from "@/interfaces/recipe";
import { patchRecipe } from "@/services/generateService";
import { delete_recipe } from "@/services/generateService";


interface RecipePopupProps {
  onClose: () => void;
  recipe: IRecipe;
}

export const RecipePopup: React.FC<RecipePopupProps> = ({ onClose, recipe }) => {
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();

  const isOwner = user?.id === recipe.user_id;

  const ingredients = recipe?.ingredients || [];

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [published, setPublished] = useState(recipe.is_published ?? false);
  const [name, setName] = useState(recipe.dish_name);

  useEffect(() => {
    setPublished(recipe.is_published ?? false);
    setName(recipe.dish_name);
  }, [recipe.id, recipe.dish_name, recipe.is_published]);  


  const handlePatch = async () => {
    try {
      setIsLoading(true);
      await patchRecipe(recipe.id, {
        dish_name: name,
        publish: published,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      setIsPublishing(true);
      const newStatus = !published;
      await patchRecipe(recipe.id, {
        dish_name: name,
        publish: newStatus,
      });      
      setPublished(newStatus);
    } catch (error) {
      console.error("Error toggling publish status:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      setIsDeleting(true);
      await delete_recipe(recipe.id);
      onClose(); // Закрываем попап после удаления
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={Styles.overlay}>
      <div className={Styles.popup}>
        <button className={Styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={Styles.topSection}>
          <div>
            <div className={Styles.imageWrapper}>
              <Image
                src={recipe.image_path || "/images/placeholder.png"}
                alt={recipe.dish_name}
                fill
                style={{ objectFit: "cover", borderRadius: "12px" }}
              />
            </div>
            {isOwner && (
              <div className={Styles.buttons}>
                <button
                  onClick={handleTogglePublish}
                  className="button"
                  disabled={isPublishing}
                  style={{ margin: "2vh 0" }}
                >
                  {isPublishing
                    ? published
                      ? "Unpublishing..."
                      : "Publishing..."
                    : published
                    ? "Unpublish"
                    : "Publish"}
                </button>
                <button
                  onClick={handleDelete}
                  className="buttonRed"
                  disabled={isDeleting}
                  style={{ margin: "2vh 0" }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>

          <div className={Styles.details}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={Styles.nameInput}
                  />
                  <button onClick={handlePatch} disabled={isLoading} className="button">
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <>
                  <h2>{name}</h2>
                  {isAuthenticated && isOwner && (
                    <Pencil
                      size={20}
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </>
              )}
            </div>

            <p className={Styles.author}>by {recipe.user_name}</p>

            {ingredients.length > 0 && (
              <ul className={Styles.ingredientList}>
                {ingredients.map((item, i) => (
                  <li key={i}>🧂 {item.trim()}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={Styles.recipeBody}>
          <h3>Recipe</h3>
          <p>{recipe.recipe}</p>
        </div>

        {isAuthenticated && (
          <p className={Styles.authInfo}>You are logged in</p>
        )}
      </div>
    </div>
  );
};
