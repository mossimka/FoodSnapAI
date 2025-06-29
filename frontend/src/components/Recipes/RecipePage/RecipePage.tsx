"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import Styles from "./RecipePage.module.css";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { IRecipe } from "@/interfaces/recipe";
import { get_recipe_by_slug, patchRecipe, delete_recipe } from "@/services/generateService";
import { ShowCaloriesButton } from "@/components/Generation/Calories/ShowCaloriesButton/ShowCaloriesButton";
import { Calories } from "@/components/Generation/Calories/Calories";

interface RecipePageProps {
  slug: string;
}

export const RecipePage: React.FC<RecipePageProps> = ({ slug }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();

  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [published, setPublished] = useState(false);
  const [name, setName] = useState("");
  const [showCalories, setShowCalories] = useState(false);

  const isOwner = user?.id === recipe?.user_id;

  // Load recipe data
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        const recipeData = await get_recipe_by_slug(slug);
        setRecipe(recipeData);
        setPublished(recipeData.is_published ?? false);
        setName(recipeData.dish_name);
        setError(null);
      } catch (err) {
        setError("Recipe not found");
        console.error("Error loading recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadRecipe();
    }
  }, [slug]);

  // Update state when recipe changes
  useEffect(() => {
    if (recipe) {
      setPublished(recipe.is_published ?? false);
      setName(recipe.dish_name);
    }
  }, [recipe?.id, recipe?.dish_name, recipe?.is_published]);

  const handlePatch = async () => {
    if (!recipe) return;
    
    try {
      setIsLoading(true);
      await patchRecipe(recipe.id, {
        dish_name: name,
        publish: published,
      });
      setIsEditing(false);
      setRecipe({ ...recipe, dish_name: name, is_published: published });
      toast.success("Recipe updated successfully!");
    } catch (error) {
      toast.error("Failed to update recipe. Error: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!recipe) return;
    
    try {
      setIsPublishing(true);
      const newStatus = !published;
      await patchRecipe(recipe.id, {
        dish_name: name,
        publish: newStatus,
      });
      setPublished(newStatus);
      setRecipe({ ...recipe, is_published: newStatus });
    } catch (error) {
      console.error("Error toggling publish status:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!recipe) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      setIsDeleting(true);
      await delete_recipe(recipe.id);
      toast.success("Recipe deleted successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
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
                  disabled={isPublishing}
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
                  <h1 className={Styles.recipeName}>{name}</h1>
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
          <h3>Recipe</h3>
          <p>{recipe.recipe}</p>
        </div>
      </div>
    </div>
  );
}; 