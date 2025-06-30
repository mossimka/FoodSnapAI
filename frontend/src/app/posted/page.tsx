"use client";

import React, { useState } from "react";
import Styles from "./posted.module.css";
import { motion, AnimatePresence } from "framer-motion";

import { RecipeCard } from "@/components/Recipes/RecipeCard/RecipeCard";
import { usePublicRecipesQuery, useMyRecipesQuery } from "@/hooks/useRecipesQueries";
import { IRecipe } from "@/interfaces/recipe";

export default function PostedPage() {
  const [activeTab, setActiveTab] = useState<"public" | "my">("public");
  
  const { 
    data: publicRecipes = [], 
    isLoading: publicLoading, 
    error: publicError 
  } = usePublicRecipesQuery();
  
  const { 
    data: myRecipes = [], 
    isLoading: myLoading, 
    error: myError 
  } = useMyRecipesQuery();

  const recipesToShow = activeTab === "public" ? publicRecipes : myRecipes;
  const isLoading = publicLoading || myLoading;
  const hasError = publicError || myError;

  // Loading state
  if (isLoading) {
    return (
      <div className={Styles.postedSection}>
        <div className={Styles.loading}>Loading recipes...</div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={Styles.postedSection}>
        <div className={Styles.error}>
          <h2>Failed to load recipes</h2>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

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
        <AnimatePresence mode="wait">
          {recipesToShow.length > 0 ? (
            recipesToShow.map((r: IRecipe) => (
              <motion.div
                key={`${r.dish_name}-${r.user_id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ width: "100%" }}
              >
                <RecipeCard 
                  recipe={r} 
                  hidePublishedBadge={activeTab === "public"}
                />
              </motion.div>
            ))
          ) : (
            <motion.p
              className={Styles.noRecipes}
              key="no-recipes"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              No recipes to show
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
