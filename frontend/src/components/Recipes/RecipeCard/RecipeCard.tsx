"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IRecipe } from "@/interfaces/recipe";
import styles from "./RecipeCard.module.css";

interface RecipeCardProps {
  recipe: IRecipe;
  hidePublishedBadge?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, hidePublishedBadge = false }) => {
  const recipeUrl = `/recipe/${recipe.slug}`;

  return (
    <Link href={recipeUrl} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image
            src={recipe.image_path || "/images/placeholder.png"}
            alt={recipe.dish_name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.title}>{recipe.dish_name}</h3>
          <p className={styles.author}>by {recipe.user.username}</p>
          <div className={styles.ingredients}>
            {recipe.ingredients_calories.slice(0, 3).map((item, i) => (
              <span key={i} className={styles.ingredient}>
                {item.ingredient}
              </span>
            ))}
            {recipe.ingredients_calories.length > 3 && (
              <span className={styles.moreIngredients}>
                +{recipe.ingredients_calories.length - 3} more
              </span>
            )}
          </div>
          {recipe.is_published && !hidePublishedBadge ? (
            <span className={styles.publishedBadge}>Published</span>
          ) : !recipe.is_published ? (
            <span className={styles.unpublishedBadge}>Unpublished</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
};