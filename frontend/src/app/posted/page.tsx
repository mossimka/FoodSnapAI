"use client";

import React, { useState, useMemo } from "react";
import Styles from "./posted.module.css";
import { motion, AnimatePresence } from "framer-motion";

import { RecipeCard } from "@/components/Recipes/RecipeCard/RecipeCard";
import { usePublicRecipesQuery, useMyRecipesQuery } from "@/hooks/useRecipesQueries";
import { IRecipe } from "@/interfaces/recipe";
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

export default function PostedPage() {
  const [activeTab, setActiveTab] = useState<"public" | "my">("public");
  const [searchQuery, setSearchQuery] = useState("");
  const [publicPage, setPublicPage] = useState(1);
  const [myPage, setMyPage] = useState(1);
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

  const publicRecipes = publicRecipesData?.recipes || [];
  const myRecipes = myRecipesData?.recipes || [];

  // For search, we need to get filtered results from current page
  const filteredPublicRecipes = useMemo(() => 
    filterRecipes(publicRecipes, searchQuery), 
    [publicRecipes, searchQuery]
  );
  
  const filteredMyRecipes = useMemo(() => 
    filterRecipes(myRecipes, searchQuery), 
    [myRecipes, searchQuery]
  );

  const recipesToShow = activeTab === "public" ? filteredPublicRecipes : filteredMyRecipes;
  const currentData = activeTab === "public" ? publicRecipesData : myRecipesData;
  const isLoading = publicLoading || myLoading;
  const hasError = publicError || myError;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Reset to first page when searching
    if (activeTab === "public") {
      setPublicPage(1);
    } else {
      setMyPage(1);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  const handlePageChange = (page: number) => {
    if (activeTab === "public") {
      setPublicPage(page);
    } else {
      setMyPage(page);
    }
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: "public" | "my") => {
    setActiveTab(tab);
    setSearchQuery(""); // Clear search when switching tabs
  };

  if (isLoading && recipesToShow.length === 0) {
    return (
      <div className={Styles.postedSection}>
        <div className={Styles.loading}>Loading recipes...</div>
      </div>
    );
  }

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
              {searchQuery ? 
                `No recipes found for "${searchQuery}"` : 
                "No recipes to show"
              }
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination controls - only show when not searching */}
      {currentData && !searchQuery && currentData.total_pages > 1 && (
        <Pagination
          currentPage={activeTab === "public" ? publicPage : myPage}
          totalPages={currentData.total_pages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          showInfo={true}
          totalItems={currentData.total}
          itemsPerPage={pageSize}
        />
      )}

      {/* Loading overlay for page changes */}
      {isLoading && recipesToShow.length > 0 && (
        <div className={Styles.loadingOverlay}>
          <div className={Styles.loadingSpinner}>Loading...</div>
        </div>
      )}
    </div>
  );
}
