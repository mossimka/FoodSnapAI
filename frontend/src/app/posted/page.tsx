"use client";

import React, { useState, useMemo } from "react";
import Styles from "./posted.module.css";
import { motion, AnimatePresence } from "framer-motion";

import { RecipeCard } from "@/components/Recipes/RecipeCard/RecipeCard";
import { usePublicRecipesQuery, useMyRecipesQuery, useFavoriteRecipesQuery } from "@/hooks/useRecipesQueries";
import { IRecipe, FavoriteRecipe, SortOrder } from "@/interfaces/recipe";
import { Search } from "@/components/Recipes/Search/Search";
import { Pagination } from "@/components/Pagination/Pagination";
import { CategoryFilterButton } from "@/components/Recipes/Categories/CategoryFilterButton/CategoryFilterButton";
import { CategorySelector } from "@/components/Recipes/Categories/CategorySelector/CategorySelector";

const filterRecipes = (recipes: IRecipe[], query: string, selectedCategories: string[] = []): IRecipe[] => {
  let filteredRecipes = recipes;
  
  // Filter by categories first
  if (selectedCategories.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => {
      const recipeCategories = recipe.categories.map(cat => cat.name);
      return selectedCategories.some(selectedCat => recipeCategories.includes(selectedCat));
    });
  }
  
  // Then filter by search query
  if (!query.trim()) return filteredRecipes;
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  return filteredRecipes.filter(recipe => {
    const dishName = recipe.dish_name.toLowerCase();
    const username = recipe.user.username.toLowerCase();
    const ingredients = recipe.ingredients_calories
      .map(ing => ing.ingredient.toLowerCase())
      .join(' ');
    
    const searchableText = `${dishName} ${username} ${ingredients}`;
    
    return searchTerms.some(term => searchableText.includes(term));
  });
};

const filterFavoriteRecipes = (favoriteRecipes: FavoriteRecipe[], query: string, selectedCategories: string[] = []): FavoriteRecipe[] => {
  let filteredRecipes = favoriteRecipes;
  
  // Filter by categories first
  if (selectedCategories.length > 0) {
    filteredRecipes = filteredRecipes.filter(favoriteRecipe => {
      const recipeCategories = favoriteRecipe.recipe.categories.map(cat => cat.name);
      return selectedCategories.some(selectedCat => recipeCategories.includes(selectedCat));
    });
  }
  
  // Then filter by search query
  if (!query.trim()) return filteredRecipes;
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  return filteredRecipes.filter(favoriteRecipe => {
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [sortBy, setSortBy] = useState<SortOrder>(SortOrder.NEWEST);
  const [publicPage, setPublicPage] = useState(1);
  const [myPage, setMyPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const pageSize = 12; // Reduced for better UX

  const { 
    data: publicRecipesData, 
    isLoading: publicLoading, 
    error: publicError 
  } = usePublicRecipesQuery(publicPage, pageSize, sortBy);
  
  const { 
    data: myRecipesData, 
    isLoading: myLoading, 
    error: myError 
  } = useMyRecipesQuery(myPage, pageSize, sortBy);

  const { 
    data: favoriteRecipesData, 
    isLoading: favoriteLoading, 
    error: favoriteError 
  } = useFavoriteRecipesQuery(savedPage, pageSize, sortBy);

  const filteredPublicRecipes = useMemo(() => {
    const publicRecipes = publicRecipesData?.recipes || [];
    return filterRecipes(publicRecipes, searchQuery, selectedCategories);
  }, [publicRecipesData?.recipes, searchQuery, selectedCategories]);
  
  const filteredMyRecipes = useMemo(() => {
    const myRecipes = myRecipesData?.recipes || [];
    return filterRecipes(myRecipes, searchQuery, selectedCategories);
  }, [myRecipesData?.recipes, searchQuery, selectedCategories]);

  const filteredFavoriteRecipes = useMemo(() => {
    const favoriteRecipes = favoriteRecipesData?.recipes || [];
    return filterFavoriteRecipes(favoriteRecipes, searchQuery, selectedCategories);
  }, [favoriteRecipesData?.recipes, searchQuery, selectedCategories]);

  const recipesToShow = activeTab === "public" 
    ? filteredPublicRecipes 
    : activeTab === "my" 
    ? filteredMyRecipes 
    : filteredFavoriteRecipes.map(fr => fr.recipe);

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

  const handleFilterSortApply = (categories: string[], newSortBy: SortOrder) => {
    setSelectedCategories(categories);
    setSortBy(newSortBy);
    // Reset to first page when filtering or sorting
    if (activeTab === "public") {
      setPublicPage(1);
    } else if (activeTab === "my") {
      setMyPage(1);
    } else {
      setSavedPage(1);
    }
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
    setSelectedCategories([]); // Clear category filters when switching tabs
    setSortBy(SortOrder.NEWEST); // Reset sorting when switching tabs
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
          <CategoryFilterButton
            selectedCategories={selectedCategories}
            sortBy={sortBy}
            onClick={() => setShowCategorySelector(true)}
          />
        </div>
      </div>

      {/* Pagination info */}
      {currentData && !searchQuery && selectedCategories.length === 0 && (
        <div className={Styles.paginationInfo}>
          Showing {recipesToShow.length} of {currentData.total} recipes
          {currentData.total_pages > 1 && (
            <span> • Page {currentData.page} of {currentData.total_pages}</span>
          )}
        </div>
      )}

      {/* Filter info */}
      {(searchQuery || selectedCategories.length > 0) && (
        <div className={Styles.paginationInfo}>
          Showing {recipesToShow.length} filtered recipes
          {searchQuery && <span> • Search: "{searchQuery}"</span>}
          {selectedCategories.length > 0 && (
            <span> • {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected</span>
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
              {searchQuery || selectedCategories.length > 0 ? 
                "No recipes found matching your filters" : 
                activeTab === "saved" ? "No saved recipes yet" : "No recipes to show"
              }
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination controls - only show when not filtering */}
      {currentData && !searchQuery && selectedCategories.length === 0 && currentData.total_pages > 1 && (
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

      {/* Category Selector Popup */}
      <CategorySelector
        isOpen={showCategorySelector}
        onClose={() => setShowCategorySelector(false)}
        selectedCategories={selectedCategories}
        sortBy={sortBy}
        onApply={handleFilterSortApply}
      />
    </div>
  );
}
