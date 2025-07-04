'use client';

import React, { useState } from "react";
import Image from "next/image";

import Styles from "./profile.module.css";
import RecipeStyles from "../posted/posted.module.css"
import { useUserQuery } from "@/hooks/useUserQuery";
import { useMyRecipesQuery } from "@/hooks/useRecipesQueries";
import { RecipeCard } from "@/components/Recipes/RecipeCard/RecipeCard";
import { Pagination } from "@/components/Pagination/Pagination";

export default function ProfilePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const { data: user} = useUserQuery();

  const { 
    data: myRecipesData, 
    isLoading: myLoading, 
    error: myError 
  } = useMyRecipesQuery(currentPage, pageSize);

  const myRecipes = myRecipesData?.recipes || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return (
      <div className={Styles.wrapper}>
        <p>You are not logged in</p>
      </div>
    );
  }

  if (myLoading && myRecipes.length === 0) {
    return (
      <div className={Styles.wrapper}>
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (myError) {
    return (
      <div className={Styles.wrapper}>
        <p>Error loading recipes. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.profileCard}>
        <div className={Styles.pictureWrapper}>
          <Image
            src={user?.profile_pic || "/images/user.png"}
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
        <h3>My recipes</h3>
        {myRecipesData && myRecipesData.total > 0 && (
          <div className={Styles.recipeStats}>
            Total recipes: {myRecipesData.total}
            {myRecipesData.total_pages > 1 && (
              <span> • Page {myRecipesData.page} of {myRecipesData.total_pages}</span>
            )}
          </div>
        )}
        <div className={RecipeStyles.recipeList}>
          {myRecipes.length > 0 ? (
            myRecipes.map((r) => (
              <RecipeCard key={`${r.dish_name} - ${r.user_id}`} recipe={r} />
            ))
          ) : (
            <p className={RecipeStyles.noRecipes}>No recipes to show</p>
          )}
        </div>
        
        {myRecipesData && myRecipesData.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={myRecipesData.total_pages}
            onPageChange={handlePageChange}
            isLoading={myLoading}
            showInfo={true}
            totalItems={myRecipesData.total}
            itemsPerPage={pageSize}
          />
        )}

        {/* Loading overlay for page changes */}
        {myLoading && myRecipes.length > 0 && (
          <div className={Styles.loadingOverlay}>
            <div className={Styles.loadingSpinner}>Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
}
