"use client";

import React from "react";
import Image from "next/image";

import { IRecipe } from "@/interfaces/recipe";
import Styles from "./RecipeCard.module.css";

export function RecipeCard({ recipe }: { recipe: IRecipe }) {
  return (
    <div className={Styles.recipeCard}>
      <Image
        src={recipe.image_path || "/images/placeholder.png"}
        alt={recipe.dish_name}
        className={Styles.recipeImage}
        width={300}
        height={200}
      />

      <div className={Styles.content}>
        <div className={Styles.author}>
          <Image
            src={recipe.user_avatar || "/images/default-avatar.png"}
            alt={recipe.user_name}
            width={40}
            height={40}
            className={Styles.avatar}
          />
          <span>Author: {recipe.user_name}</span>
        </div>

        <div className={Styles.recipeName}>Recipe Name: {recipe.dish_name}</div>
      </div>
    </div>
  );
}
