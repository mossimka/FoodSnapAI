"use client";

import React from "react";
import { ChefHat, Copy, ShoppingCart } from "lucide-react";
import { GenerationOutput } from "@/interfaces/recipe";
import { RecipeSteps } from "../../Recipes/RecipeSteps/RecipeSteps";
import { CaloriesSection } from "../Calories/CaloriesSection/CaloriesSection";
import { toast } from "react-toastify";
import Styles from "./RecipeDisplay.module.css";

interface RecipeDisplayProps {
  recipe: GenerationOutput;
  isAnimating?: boolean;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ 
  recipe, 
  isAnimating = false
}) => {

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
      <div className={Styles.container}>
        <div className={Styles.loading}>
          <div className={Styles.loadingSpinner} />
          <p>Generating your recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      {/* Header Section */}
      <div className={Styles.header}>
        <div className={Styles.dishTitle}>
          <ChefHat className={Styles.titleIcon} />
          <h1 className={Styles.dishName}>{recipe.recipe.dish_name}</h1>
        </div>
        <div className={Styles.headerActions}>
          <button
            onClick={() => copyToClipboard(recipe.recipe.dish_name, "Dish name")}
            className={Styles.copyButton}
            title="Copy dish name"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Nutrition Information Section */}
        <CaloriesSection
          caloriesData={{
          dish_name: recipe.recipe.dish_name,
          ingredients_calories: recipe.recipe.ingredients_calories,
          estimated_weight_g: recipe.recipe.estimated_weight_g,
          total_calories_per_100g: recipe.recipe.total_calories_per_100g,
          total_calories: totalCalories
        }}
      />

      {/* Ingredients Section */}
      <div className={Styles.section}>
        <div className={Styles.sectionHeader}>
          <h2 className={Styles.sectionTitle}>
            <span className={Styles.emoji}>🧂</span>
            Ingredients
          </h2>
          <button
            onClick={() => copyToClipboard(
              recipe.recipe.ingredients_calories.map(ing => `${ing.ingredient}`).join('\n'),
              "Ingredients list"
            )}
            className={Styles.copyButton}
            title="Copy ingredients"
          >
            <Copy size={16} />
          </button>
        </div>
        
        <div className={Styles.ingredientsList}>
          {recipe.recipe.ingredients_calories.map((ingredient, index) => {
            const deliveryLink = findDeliveryLink(ingredient.ingredient);
            
            return (
              <div key={index} className={Styles.ingredientCard}>
                <div className={Styles.ingredientName}>{ingredient.ingredient}</div>
                <span className={Styles.ingredientCalories}>{ingredient.calories} cal/100g</span>
                {deliveryLink && (
                  <a 
                    href={deliveryLink.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={Styles.deliveryLink}
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
    </div>
  );
}; 