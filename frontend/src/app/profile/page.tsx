'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";

import Styles from "./profile.module.css";
import RecipeStyles  from "../posted/posted.module.css"
import { useUserQuery } from "@/hooks/useUserQuery";
import { IRecipe } from "@/interfaces/recipe";
import { get_my_recipes } from "@/services/generateService";
import { RecipeCard } from "@/components/Recipes/RecipeCard/RecipeCard";

export default function ProfilePage() {
  const { data: user} = useUserQuery();
  const [myRecipes, setMyRecipes] = useState<IRecipe[]>([]);

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
          <Image
            src={user?.profile_pic|| "/images/user.png"}
            alt="user"
            className={Styles.user}
            width={200}
            height={200}
          />
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
              <RecipeCard key={`${r.dish_name} - ${r.user_id}`} recipe={r} />
            ))
          ) : (
            <p className={RecipeStyles.noRecipes}>No recipes to show</p>
          )}
        </div>
      </div>
    </div>
  );
}
