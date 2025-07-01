"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, ArrowLeft } from "lucide-react";

import Styles from "./RecipePage.module.css";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { ShowCaloriesButton } from "@/components/Generation/Calories/ShowCaloriesButton/ShowCaloriesButton";
import { Calories } from "@/components/Generation/Calories/Calories";
import { RecipeSteps } from "@/components/Recipes/RecipeSteps/RecipeSteps";
import { 
  useRecipeQuery, 
  useUpdateRecipeNameMutation, 
  useToggleRecipePublishMutation, 
  useDeleteRecipeMutation 
} from "@/hooks/useRecipeQueries";

interface RecipePageProps {
  slug: string;
}

export const RecipePage: React.FC<RecipePageProps> = ({ slug }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();

  const { 
    data: recipe, 
    isLoading, 
    error 
  } = useRecipeQuery(slug);

  const updateRecipeName = useUpdateRecipeNameMutation(slug);
  const togglePublish = useToggleRecipePublishMutation(slug);
  const deleteRecipe = useDeleteRecipeMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [showCalories, setShowCalories] = useState(false);

  const isOwner = user?.id === recipe?.user_id;

  useEffect(() => {
    if (recipe) {
      setName(recipe.dish_name);
    }
  }, [recipe?.dish_name]);

  const handleUpdateName = () => {
    if (!recipe || !name.trim()) return;
    
    updateRecipeName.mutate(
      { id: recipe.id, dish_name: name },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const handleTogglePublish = () => {
    if (!recipe) return;
    
    togglePublish.mutate({
      id: recipe.id,
      is_published: !recipe.is_published
    });
  };

  const handleDelete = () => {
    if (!recipe) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    
    deleteRecipe.mutate(recipe.id);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className={Styles.container}>
        <div className={Styles.loading}>Loading recipe...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className={Styles.container}>
        <div className={Styles.error}>
          <h2>Recipe not found</h2>
          <p>The recipe you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button onClick={handleGoBack} className="button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <button onClick={handleGoBack} className={Styles.backButton}>
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <div className={Styles.content}>
        <div className={Styles.topSection}>
          <div className={Styles.info}>
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
                  disabled={togglePublish.isPending}
                >
                  {togglePublish.isPending
                    ? recipe.is_published
                      ? "Unpublishing..."
                      : "Publishing..."
                    : recipe.is_published
                    ? "Unpublish"
                    : "Publish"}
                </button>
                <button
                  onClick={handleDelete}
                  className="buttonRed"
                  disabled={deleteRecipe.isPending}
                >
                  {deleteRecipe.isPending ? "Deleting..." : "Delete"}
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
                  <button 
                    onClick={handleUpdateName} 
                    disabled={updateRecipeName.isPending || !name.trim()} 
                    className="button"
                  >
                    {updateRecipeName.isPending ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <>
                  <h1 className={Styles.recipeName}>{recipe.dish_name}</h1>
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

            <p className={Styles.author}>by {recipe.user.username}</p>

            <div className={Styles.statusBadge}>
              {recipe.is_published ? (
                <span className={Styles.publishedBadge}>Published</span>
              ) : (
                <span className={Styles.unpublishedBadge}>Unpublished</span>
              )}
            </div>

            <div className={Styles.ingredients}>
              <h3>Ingredients</h3>
              <ul className={Styles.ingredientList}>
                {recipe.ingredients_calories.map((item, i) => (
                  <li key={i}>
                    🧂 {item.ingredient}
                  </li>
                ))}
              </ul>
              <ShowCaloriesButton
                text="Show calories"
                onClick={() => setShowCalories(true)}
                style={{ marginTop: "1rem" }}
              />
              <Calories
                open={showCalories}
                onClose={() => setShowCalories(false)}
                caloriesData={{
                  ingredients_calories: recipe.ingredients_calories || [],
                  estimated_weight_g: recipe.estimated_weight_g ?? null,
                  total_calories_per_100g: recipe.total_calories_per_100g,
                  total_calories: recipe.total_calories_per_100g && recipe.estimated_weight_g
                    ? Math.round((recipe.total_calories_per_100g * recipe.estimated_weight_g) / 100)
                    : null
                }}
              />
            </div>
          </div>
        </div>

        <div className={Styles.recipeBody}>
          <RecipeSteps 
            recipeText={recipe.recipe}
            recipeId={recipe.id}
            recipeName={recipe.dish_name}
          />
        </div>
      </div>
    </div>
  );
}; 