import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Filter, Check } from "lucide-react";
import { CategoryIcon } from "../CategoryIcon/CategoryIcon";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import Styles from "./CategorySelector.module.css";

interface CategorySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onApply: (categories: string[]) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  onApply,
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedCategories);
  const { data: categories, isLoading, error } = useCategoriesQuery();

  useEffect(() => {
    setLocalSelected(selectedCategories);
  }, [selectedCategories]);

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

  const handleClear = () => {
    setLocalSelected([]);
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  if (!isOpen) return null;

  const popup = (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.header}>
          <h2 className={Styles.title}>
            <Filter className={Styles.titleIcon} />
            Filter by Categories
          </h2>
          <button 
            className={Styles.closeButton} 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={Styles.content}>
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
        
        <div className={Styles.actions}>
          <button 
            className={Styles.clearButton} 
            onClick={handleClear}
            disabled={localSelected.length === 0}
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