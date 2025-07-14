import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Filter, ArrowUpDown, Check } from "lucide-react";
import { CategoryIcon } from "../CategoryIcon/CategoryIcon";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import { SortOrder } from "@/interfaces/recipe";
import Styles from "./CategorySelector.module.css";

interface CategorySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onApply: (categories: string[], sortBy: SortOrder) => void;
  sortBy: SortOrder;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  onApply,
  sortBy,
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedCategories);
  const [localSortBy, setLocalSortBy] = useState<SortOrder>(sortBy);
  const { data: categories, isLoading, error } = useCategoriesQuery();

  useEffect(() => {
    setLocalSelected(selectedCategories);
    setLocalSortBy(sortBy);
  }, [selectedCategories, sortBy]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleCategoryToggle = (category: string) => {
    setLocalSelected(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSortChange = (newSortBy: SortOrder) => {
    setLocalSortBy(newSortBy);
  };

  const handleClear = () => {
    setLocalSelected([]);
    setLocalSortBy(SortOrder.NEWEST);
  };

  const handleApply = () => {
    onApply(localSelected, localSortBy);
    onClose();
  };

  const sortOptions = [
    { value: SortOrder.NEWEST, label: "Newest" },
    { value: SortOrder.OLDEST, label: "Oldest" },
    { value: SortOrder.NAME_ASC, label: "Name A-Z" },
    { value: SortOrder.NAME_DESC, label: "Name Z-A" },
  ];

  if (!isOpen) return null;

  const popup = (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.header}>
          <h2 className={Styles.title}>
            <Filter className={Styles.titleIcon} />
            Filter & Sort
          </h2>
          <button 
            className={Styles.closeButton} 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={Styles.content}>
          {/* Categories Section */}
          <div className={Styles.section}>
            <h3 className={Styles.sectionTitle}>
              <Filter size={16} />
              Categories
            </h3>
            <p className={Styles.description}>
              Select health categories to filter recipes. You can choose multiple categories to find recipes that match your dietary preferences.
            </p>

            {isLoading && (
              <div className={Styles.loading}>
                Loading categories...
              </div>
            )}

            {error && (
              <div className={Styles.error}>
                <h3>Failed to load categories</h3>
                <p>Please try refreshing the page</p>
              </div>
            )}

            {categories && (
              <div className={Styles.categoriesGrid}>
                {categories.map((category) => {
                  const isSelected = localSelected.includes(category);
                  
                  return (
                    <div
                      key={category}
                      className={`${Styles.categoryItem} ${isSelected ? Styles.selected : ''}`}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      <div className={Styles.checkbox}>
                        {isSelected && <Check size={12} />}
                      </div>
                      
                      <CategoryIcon 
                        category={{ name: category }}
                        size={16}
                        showLabel={false}
                      />
                      
                      <div className={Styles.categoryInfo}>
                        <p className={Styles.categoryLabel}>{category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {localSelected.length > 0 && (
              <div className={Styles.selectedCount}>
                {localSelected.length} categor{localSelected.length === 1 ? 'y' : 'ies'} selected
              </div>
            )}
          </div>

          {/* Sort Section */}
          <div className={Styles.section}>
            <h3 className={Styles.sectionTitle}>
              <ArrowUpDown size={16} />
              Sort by
            </h3>
            <div className={Styles.sortOptions}>
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className={`${Styles.sortOption} ${localSortBy === option.value ? Styles.selected : ''}`}
                >
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={localSortBy === option.value}
                    onChange={() => handleSortChange(option.value)}
                    className={Styles.radioInput}
                  />
                  <div className={Styles.radioButton}>
                    {localSortBy === option.value && <div className={Styles.radioDot} />}
                  </div>
                  <span className={Styles.sortLabel}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className={Styles.actions}>
          <button 
            className={Styles.clearButton} 
            onClick={handleClear}
            disabled={localSelected.length === 0 && localSortBy === SortOrder.NEWEST}
          >
            Clear All
          </button>
          <button 
            className={Styles.applyButton} 
            onClick={handleApply}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(popup, document.body)
    : null;
}; 