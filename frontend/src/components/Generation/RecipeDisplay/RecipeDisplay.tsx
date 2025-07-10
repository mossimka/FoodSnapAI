"use client";

import React, { useState } from "react";
import { ChefHat, Copy, ShoppingCart } from "lucide-react";
import { GenerationOutput } from "@/interfaces/recipe";
import { RecipeSteps } from "../../Recipes/RecipeSteps/RecipeSteps";
import { Calories } from "../Calories/Calories";
import { ShowCaloriesButton } from "../Calories/ShowCaloriesButton/ShowCaloriesButton";
import { toast } from "react-toastify";
import styles from "./RecipeDisplay.module.css";

interface RecipeDisplayProps {
  recipe: GenerationOutput;
  isAnimating?: boolean;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ 
  recipe, 
  isAnimating = false
}) => {
  const [showCalories, setShowCalories] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  };

  const totalCalories = recipe.recipe.total_calories_per_100g && recipe.recipe.estimated_weight_g
    ? Math.round((recipe.recipe.total_calories_per_100g * recipe.recipe.estimated_weight_g) / 100)
    : null;

  const findDeliveryLink = (ingredientName: string) => {
    return recipe.delivery?.find(link => 
      link.product.toLowerCase().includes(ingredientName.toLowerCase()) ||
      ingredientName.toLowerCase().includes(link.product.toLowerCase())
    );
  };

  if (isAnimating) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <p>Generating your recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.dishTitle}>
          <ChefHat className={styles.titleIcon} />
          <h1 className={styles.dishName}>{recipe.recipe.dish_name}</h1>
        </div>
        <div className={styles.headerActions}>
          <ShowCaloriesButton
            onClick={() => setShowCalories(true)}
            text="View Nutrition"
          />
          <button
            onClick={() => copyToClipboard(recipe.recipe.dish_name, "Dish name")}
            className={styles.copyButton}
            title="Copy dish name"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Quick nutrition preview */}
      <div className={styles.quickNutrition}>
        <div className={styles.nutritionPreview}>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Weight:</span>
            <span className={styles.nutritionValue}>
              {recipe.recipe.estimated_weight_g ? `${recipe.recipe.estimated_weight_g}g` : 'N/A'}
            </span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Calories:</span>
            <span className={styles.nutritionValue}>
              {totalCalories ? `${totalCalories} kcal` : 'N/A'}
            </span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Ingredients:</span>
            <span className={styles.nutritionValue}>
              {recipe.recipe.ingredients_calories.length}
            </span>
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.emoji}>🧂</span>
            Ingredients
          </h2>
          <button
            onClick={() => copyToClipboard(
              recipe.recipe.ingredients_calories.map(ing => `${ing.ingredient}`).join('\n'),
              "Ingredients list"
            )}
            className={styles.copyButton}
            title="Copy ingredients"
          >
            <Copy size={16} />
          </button>
        </div>
        
        <div className={styles.ingredientsList}>
          {recipe.recipe.ingredients_calories.map((ingredient, index) => {
            const deliveryLink = findDeliveryLink(ingredient.ingredient);
            
            return (
              <div key={index} className={styles.ingredientCard}>
                <div className={styles.ingredientName}>{ingredient.ingredient}</div>
                {deliveryLink && (
                  <a 
                    href={deliveryLink.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.deliveryLink}
                    title={`Buy from ${deliveryLink.store || 'store'}`}
                  >
                    <ShoppingCart size={16} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recipe Steps Section - Using existing RecipeSteps component */}
      <RecipeSteps 
        recipeText={recipe.recipe.recipe}
        recipeId={0} // Temporary ID for generated recipe
        recipeName={recipe.recipe.dish_name}
      />

      {/* Calories Popup */}
      <Calories
        open={showCalories}
        onClose={() => setShowCalories(false)}
        caloriesData={{
          dish_name: recipe.recipe.dish_name,
          ingredients_calories: recipe.recipe.ingredients_calories,
          estimated_weight_g: recipe.recipe.estimated_weight_g,
          total_calories_per_100g: recipe.recipe.total_calories_per_100g,
          total_calories: totalCalories
        }}
      />
    </div>
  );
}; 