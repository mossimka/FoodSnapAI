"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IRecipe } from "@/interfaces/recipe";
import { CategoryIcon } from "@/components/Recipes/Categories/CategoryIcon/CategoryIcon";
import Styles from "./RecipeCard.module.css";

interface RecipeCardProps {
  recipe: IRecipe;
  hidePublishedBadge?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, hidePublishedBadge = false }) => {
  const recipeUrl = `/recipe/${recipe.slug}`;

  return (
    <Link href={recipeUrl} className={Styles.cardLink}>
      <div className={Styles.card}>
        <div className={Styles.imageWrapper}>
          <Image
            src={recipe.image_path || "/images/placeholder.png"}
            alt={recipe.dish_name}
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Health Categories */}
          {recipe.categories && recipe.categories.length > 0 && (
            <div className={Styles.healthCategories}>
              {recipe.categories.slice(0, 3).map((category) => (
                <CategoryIcon 
                  key={category.id} 
                  category={{ name: category.name }}
                  size={14}
                  showLabel={false}
                />
              ))}
              {recipe.categories.length > 3 && (
                <div className={Styles.moreCategoriesIndicator} title={`+${recipe.categories.length - 3} more categories`}>
                  +{recipe.categories.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
        <div className={Styles.cardContent}>
          <h3 className={Styles.title}>{recipe.dish_name}</h3>
          <div className={Styles.authorAndIcons}>
            <p className={Styles.author}>by {recipe.user.username}</p>
            <div className={Styles.icons}>
              {recipe.is_halal && <Image src="/images/halal.png" alt="Halal" width={24} height={24} />}
              {recipe.is_vegan && <Image src="/images/vegan.png" alt="Vegan" width={24} height={24} />}
            </div>
          </div>
          <div className={Styles.ingredients}>
            {recipe.ingredients_calories.slice(0, 3).map((item, i) => (
              <span key={i} className={Styles.ingredient}>
                {item.ingredient.slice(0, 10)}...
              </span>
            ))}
            {recipe.ingredients_calories.length > 3 && (
              <span className={Styles.moreIngredients}>
                +{recipe.ingredients_calories.length - 3} more
              </span>
            )}
          </div>
          {recipe.is_published && !hidePublishedBadge ? (
            <span className={Styles.publishedBadge}>Published</span>
          ) : !recipe.is_published ? (
            <span className={Styles.unpublishedBadge}>Unpublished</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
};