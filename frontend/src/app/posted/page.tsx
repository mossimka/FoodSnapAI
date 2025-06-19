"use client";

import React, { useEffect, useState } from "react";
import Styles from "./posted.module.css";

import { RecipeCard } from "@/components/Recipes/RecipeCard/RecipeCard";
import { IRecipe } from "@/interfaces/recipe";
import { get_public_recipes, get_my_recipes } from "@/services/generateService";
import { RecipePopup } from "@/components/Recipes/RecipePopup/RecipePopup";


export default function PostedPage() {
  const [activeTab, setActiveTab] = useState<"public" | "my">("public");
  const [publicRecipes, setPublicRecipes] = useState<IRecipe[]>([]);
  const [myRecipes, setMyRecipes] = useState<IRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);


  useEffect(() => {
    get_public_recipes()
      .then(setPublicRecipes)
      .catch((err) => console.error("Public error:", err));

    get_my_recipes()
      .then(setMyRecipes)
      .catch((err) => console.error("My error:", err));
  }, []);

  const recipesToShow = activeTab === "public" ? publicRecipes : myRecipes;

  return (
    <div className={Styles.postedSection}>
      <div className={Styles.tabToggle}>
        <button
          className={`${Styles.tabButton} ${activeTab === "public" ? Styles.active : ""}`}
          onClick={() => setActiveTab("public")}
        >
          Public
        </button>
        <button
          className={`${Styles.tabButton} ${activeTab === "my" ? Styles.active : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My recipes
        </button>
      </div>

      <div className={Styles.recipeList}>
        {recipesToShow.length > 0 ? (
          recipesToShow.map((r) => (
            <RecipeCard key={`${r.dish_name}-${r.user_id}`} recipe={r} onClick={() => setSelectedRecipe(r)} />
          ))
        ) : (
          <p className={Styles.noRecipes}>No recipes to show</p>
        )}
      </div>

      {selectedRecipe && (
        <RecipePopup
          onClose={() => setSelectedRecipe(null)}
          recipe={selectedRecipe}
        />
      )}
    </div>
  );
}
