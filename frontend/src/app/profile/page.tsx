'use client';

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Styles from "./profile.module.css";
import RecipeStyles  from "../posted/posted.module.css"
import { useUserStore } from "@/stores/userStore";
import ProfilePicUploader from "@/components/Generation/ProfilePicUploader/ProfilePicUploader";
import { IRecipe } from "@/interfaces/recipe";
import { get_my_recipes } from "@/services/generateService";
import { RecipeCard } from "@/components/Recipes/RecipeCard/RecipeCard";
import { RecipePopup } from "@/components/Recipes/RecipePopup/RecipePopup";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [myRecipes, setMyRecipes] = useState<IRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);

  useEffect(()  => {
    get_my_recipes()
      .then(setMyRecipes)
      .catch((err) => console.error("My error:", err));
  }, []);

  if (!user) {
    return (
      <div className={Styles.wrapper}>
        <p>You are not logged in</p>
      </div>
    );
  }

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.profileCard}>
        <div className={Styles.pictureWrapper}>
          <ProfilePicUploader />
        </div>
        <div className={Styles.profileInfo}>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className={Styles.recipesSection}>
        <h3>Loaded recipes</h3>
        <div className={RecipeStyles.recipeList}>
          {myRecipes.length > 0 ? (
            myRecipes.map((r) => (
              <RecipeCard  key={`${r.dish_name} - ${r.user_id}`} recipe={r} onClick={() => setSelectedRecipe(r)} />
            ))
          ) : (
            <p className={RecipeStyles.noRecipes}>No recipes to show</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedRecipe && (
          <RecipePopup
            onClose={() => setSelectedRecipe(null)}
            recipe={selectedRecipe}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
