import React from "react";
import { Filter } from "lucide-react";
import Styles from "./CategoryFilterButton.module.css";

interface CategoryFilterButtonProps {
  selectedCategories: string[];
  onClick: () => void;
}

export const CategoryFilterButton: React.FC<CategoryFilterButtonProps> = ({
  selectedCategories,
  onClick,
}) => {
  const hasFilters = selectedCategories.length > 0;

  return (
    <button
      className={`${Styles.filterButton} ${hasFilters ? Styles.active : ''}`}
      onClick={onClick}
      title={hasFilters ? `${selectedCategories.length} categories selected` : "Filter by categories"}
    >
      <Filter size={18} className={Styles.icon} />
      <span className={Styles.label}>Categories</span>
      {hasFilters && (
        <span className={Styles.count}>
          {selectedCategories.length}
        </span>
      )}
    </button>
  );
}; 