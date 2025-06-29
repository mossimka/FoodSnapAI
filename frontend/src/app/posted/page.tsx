"use client";

import React, { useEffect, useState } from "react";
import Styles from "./posted.module.css";
import { motion, AnimatePresence } from "framer-motion";

import { RecipeCard } from "@/components/Recipes/RecipeCard/RecipeCard";
import { IRecipe } from "@/interfaces/recipe";
import { get_public_recipes, get_my_recipes } from "@/services/generateService";

export default function PostedPage() {
  const [activeTab, setActiveTab] = useState<"public" | "my">("public");
  const [publicRecipes, setPublicRecipes] = useState<IRecipe[]>([]);
  const [myRecipes, setMyRecipes] = useState<IRecipe[]>([]);

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
        <AnimatePresence mode="wait">
          {recipesToShow.length > 0 ? (
            recipesToShow.map((r) => (
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
