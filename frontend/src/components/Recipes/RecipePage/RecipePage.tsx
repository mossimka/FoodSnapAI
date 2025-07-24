"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import Styles from "./RecipePage.module.css";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { CaloriesSection } from "@/components/Generation/Calories/CaloriesSection/CaloriesSection";
import { RecipeSteps } from "@/components/Recipes/RecipeSteps/RecipeSteps";
import { ConfirmationModal } from "@/components/Popups/ConfirmationModal/ConfirmationModal";
import { CategoryIcon } from "@/components/Recipes/Categories/CategoryIcon/CategoryIcon";
import Vegan from "@/components/Recipes/Icons/Vegan/Vegan";
import Halal from "@/components/Recipes/Icons/Halal/Halal";
import { 
  useRecipeQuery, 
  useUpdateRecipeNameMutation, 
  useToggleRecipePublishMutation, 
  useDeleteRecipeMutation 
} from "@/hooks/useRecipeQueries";
import { FavoriteButton } from "@/components/Recipes/FavoriteButton/FavoriteButton";
import { generatePDF } from "@/utils/generatePDF";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwner = user?.id === recipe?.user_id;

  useEffect(() => {
    if (recipe) {
      setName(recipe.dish_name);
    }
  }, [recipe]);

  const handleUpdateName = () => {
    if (!recipe || !name.trim()) return;

    if(name.length > 50) {
      toast.error("Recipe name must be less than 50 characters long");
      return;
    }
    
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
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!recipe) return;
    
    deleteRecipe.mutate(recipe.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
      },
      onError: () => {
        setShowDeleteModal(false);
      }
    });
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
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
              <div className={Styles.buttons}>
              {isOwner ? (
                <>
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
                </>
              ) : (
                <FavoriteButton 
                  recipeId={recipe.id} 
                  recipeUserId={recipe.user_id} 
                />
              )}
              <button 
                onClick={async () => {
                  try {
                    const button = event?.target as HTMLButtonElement;
                    const originalText = button.textContent;
                    button.textContent = 'Generating PDF...';
                    button.disabled = true;
                    
                    await generatePDF(recipe, `${recipe.dish_name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
                    
                    button.textContent = originalText;
                    button.disabled = false;
                  } catch (error) {
                    console.error('PDF generation failed:', error);
                    const button = event?.target as HTMLButtonElement;
                    button.textContent = 'Download PDF';
                    button.disabled = false;
                  }
                }} 
                className="button"
              >
                Download PDF
              </button>
              </div>
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

            {/* Health Categories with Vegan/Halal */}
            <div className={Styles.healthCategories}>
              {/* Existing Health Categories */}
              {recipe.categories && recipe.categories.length > 0 && 
                recipe.categories.map((category) => (
                  <CategoryIcon 
                    key={category.id} 
                    category={{ name: category.name }}
                    size={18}
                    showLabel={true}
                  />
                ))
              }
            </div>

            <div className={Styles.dietaryIcons}> 
              {/* Vegan Icon */}
              {recipe.is_vegan && (
                <div className={Styles.dietaryIcon} title="Vegan">
                  <Vegan />
                </div>
              )}
              
              {/* Halal Icon */}
              {recipe.is_halal && (
                <div className={Styles.dietaryIcon} title="Halal">
                  <Halal />
                </div>
              )}
            </div> 

            <div className={Styles.statusBadge}>
              {recipe.is_published ? (
                <span className={Styles.publishedBadge}>Published</span>
              ) : (
                <span className={Styles.unpublishedBadge}>Unpublished</span>
              )}
            </div>

            <div className={Styles.ingredients}>
              <h3>Ingredients</h3>
              <div className={Styles.ingredientsGrid}>
                {recipe.ingredients_calories.map((item, i) => (
                  <div key={i} className={Styles.ingredientCard}>
                    <span className={Styles.ingredientName}>{item.ingredient}</span>
                    <span className={Styles.ingredientCalories}>{item.calories} cal/100g</span>
                  </div>
                ))}
              </div>
            </div>
            
            <CaloriesSection
              caloriesData={{
                dish_name: recipe.dish_name,
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

        <div className={Styles.recipeBody}>
          <RecipeSteps 
            recipeText={recipe.recipe}
            recipeId={recipe.id}
            recipeName={recipe.dish_name}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteRecipe.isPending}
      />
    </div>
  );
};