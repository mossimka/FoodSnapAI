"use client";

import React, { useState, useMemo } from "react";
import Styles from "./posted.module.css";
import { motion, AnimatePresence } from "framer-motion";

import { RecipeCard } from "@/components/Recipes/RecipeCard/RecipeCard";
import { usePublicRecipesQuery, useMyRecipesQuery, useFavoriteRecipesQuery } from "@/hooks/useRecipesQueries";
import { IRecipe, FavoriteRecipe } from "@/interfaces/recipe";
import { Search } from "@/components/Recipes/Search/Search";
import { Pagination } from "@/components/Pagination/Pagination";

const filterRecipes = (recipes: IRecipe[], query: string): IRecipe[] => {
  if (!query.trim()) return recipes;
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  return recipes.filter(recipe => {
    const dishName = recipe.dish_name.toLowerCase();
    const username = recipe.user.username.toLowerCase();
    const ingredients = recipe.ingredients_calories
      .map(ing => ing.ingredient.toLowerCase())
      .join(' ');
    
    const searchableText = `${dishName} ${username} ${ingredients}`;
    
    return searchTerms.some(term => searchableText.includes(term));
  });
};

const filterFavoriteRecipes = (favoriteRecipes: FavoriteRecipe[], query: string): FavoriteRecipe[] => {
  if (!query.trim()) return favoriteRecipes;
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  return favoriteRecipes.filter(favoriteRecipe => {
    const recipe = favoriteRecipe.recipe;
    const dishName = recipe.dish_name.toLowerCase();
    const username = recipe.user.username.toLowerCase();
    const ingredients = recipe.ingredients_calories
      .map(ing => ing.ingredient.toLowerCase())
      .join(' ');
    
    const searchableText = `${dishName} ${username} ${ingredients}`;
    
    return searchTerms.some(term => searchableText.includes(term));
  });
};

export default function PostedPage() {
  const [activeTab, setActiveTab] = useState<"public" | "my" | "saved">("public");
  const [searchQuery, setSearchQuery] = useState("");
  const [publicPage, setPublicPage] = useState(1);
  const [myPage, setMyPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const pageSize = 12; // Reduced for better UX

  const { 
    data: publicRecipesData, 
    isLoading: publicLoading, 
    error: publicError 
  } = usePublicRecipesQuery(publicPage, pageSize);
  
  const { 
    data: myRecipesData, 
    isLoading: myLoading, 
    error: myError 
  } = useMyRecipesQuery(myPage, pageSize);

  const { 
    data: favoriteRecipesData, 
    isLoading: favoriteLoading, 
    error: favoriteError 
  } = useFavoriteRecipesQuery(savedPage, pageSize);

  const publicRecipes = publicRecipesData?.recipes || [];
  const myRecipes = myRecipesData?.recipes || [];
  const favoriteRecipes = favoriteRecipesData?.recipes || [];

  // For search, we need to get filtered results from current page
  const filteredPublicRecipes = useMemo(() => 
    filterRecipes(publicRecipes, searchQuery), 
    [publicRecipes, searchQuery]
  );
  
  const filteredMyRecipes = useMemo(() => 
    filterRecipes(myRecipes, searchQuery), 
    [myRecipes, searchQuery]
  );

  const filteredFavoriteRecipes = useMemo(() => 
    filterFavoriteRecipes(favoriteRecipes, searchQuery), 
    [favoriteRecipes, searchQuery]
  );

  // Determine what to show based on active tab
  const recipesToShow = activeTab === "public" 
    ? filteredPublicRecipes 
    : activeTab === "my" 
    ? filteredMyRecipes 
    : filteredFavoriteRecipes.map(fr => fr.recipe); // Extract recipe from favorite

  const currentData = activeTab === "public" 
    ? publicRecipesData 
    : activeTab === "my" 
    ? myRecipesData 
    : favoriteRecipesData;

  // Get loading and error states for current tab only
  const getCurrentLoading = () => {
    if (activeTab === "public") return publicLoading;
    if (activeTab === "my") return myLoading;
    return favoriteLoading;
  };

  const getCurrentError = () => {
    if (activeTab === "public") return publicError;
    if (activeTab === "my") return myError;
    return favoriteError;
  };

  const isCurrentTabLoading = getCurrentLoading();
  const currentTabError = getCurrentError();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Reset to first page when searching
    if (activeTab === "public") {
      setPublicPage(1);
    } else if (activeTab === "my") {
      setMyPage(1);
    } else {
      setSavedPage(1);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  const handlePageChange = (page: number) => {
    if (activeTab === "public") {
      setPublicPage(page);
    } else if (activeTab === "my") {
      setMyPage(page);
    } else {
      setSavedPage(page);
    }
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: "public" | "my" | "saved") => {
    setActiveTab(tab);
    setSearchQuery(""); // Clear search when switching tabs
  };

  const getCurrentPage = () => {
    if (activeTab === "public") return publicPage;
    if (activeTab === "my") return myPage;
    return savedPage;
  };

  if (isCurrentTabLoading && recipesToShow.length === 0) {
    return (
      <div className={Styles.postedSection}>
        <div className={Styles.loading}>Loading recipes...</div>
      </div>
    );
  }

  if (currentTabError) {
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
      <div className={Styles.controlsContainer}>
        <div className={Styles.tabToggle}>
          <button
            className={`${Styles.tabButton} ${activeTab === "public" ? Styles.active : ""}`}
            onClick={() => handleTabChange("public")}
          >
            Public
          </button>
          <button
            className={`${Styles.tabButton} ${activeTab === "my" ? Styles.active : ""}`}
            onClick={() => handleTabChange("my")}
          >
            My recipes
          </button>
          <button
            className={`${Styles.tabButton} ${activeTab === "saved" ? Styles.active : ""}`}
            onClick={() => handleTabChange("saved")}
          >
            Saved
          </button>
        </div>
        
        <div className={Styles.searchContainer}>
          <Search 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
          />
        </div>
      </div>

      {/* Pagination info */}
      {currentData && !searchQuery && (
        <div className={Styles.paginationInfo}>
          Showing {recipesToShow.length} of {currentData.total} recipes
          {currentData.total_pages > 1 && (
            <span> • Page {currentData.page} of {currentData.total_pages}</span>
          )}
        </div>
      )}

      <div className={Styles.recipeList}>
        <AnimatePresence mode="wait" key={activeTab}>
          {recipesToShow.length > 0 ? (
            recipesToShow.map((r: IRecipe) => (
              <motion.div
                key={`${activeTab}-${r.id}`}
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
              key={`no-recipes-${activeTab}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {searchQuery ? 
                `No recipes found for "${searchQuery}"` : 
                activeTab === "saved" ? "No saved recipes yet" : "No recipes to show"
              }
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination controls - only show when not searching */}
      {currentData && !searchQuery && currentData.total_pages > 1 && (
        <Pagination
          currentPage={getCurrentPage()}
          totalPages={currentData.total_pages}
          onPageChange={handlePageChange}
          isLoading={isCurrentTabLoading}
          showInfo={true}
          totalItems={currentData.total}
          itemsPerPage={pageSize}
        />
      )}

      {/* Loading overlay for page changes */}
      {isCurrentTabLoading && recipesToShow.length > 0 && (
        <div className={Styles.loadingOverlay}>
          <div className={Styles.loadingSpinner}>Loading...</div>
        </div>
      )}
    </div>
  );
}
