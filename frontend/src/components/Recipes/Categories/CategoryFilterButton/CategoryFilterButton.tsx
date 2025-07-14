import React from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import { SortOrder } from "@/interfaces/recipe";
import Styles from "./CategoryFilterButton.module.css";

interface CategoryFilterButtonProps {
  selectedCategories: string[];
  sortBy: SortOrder;
  onClick: () => void;
}

export const CategoryFilterButton: React.FC<CategoryFilterButtonProps> = ({
  selectedCategories,
  sortBy,
  onClick,
}) => {
  const hasFilters = selectedCategories.length > 0;
  const hasCustomSort = sortBy !== SortOrder.NEWEST;

  const getSortLabel = (sortBy: SortOrder) => {
    switch (sortBy) {
      case SortOrder.NEWEST:
        return "Newest";
      case SortOrder.OLDEST:
        return "Oldest";
      case SortOrder.NAME_ASC:
        return "A-Z";
      case SortOrder.NAME_DESC:
        return "Z-A";
      default:
        return "Newest";
    }
  };

  return (
    <button
      className={`${Styles.filterButton} ${hasFilters || hasCustomSort ? Styles.active : ''}`}
      onClick={onClick}
      title={
        hasFilters || hasCustomSort 
          ? `Categories: ${selectedCategories.length}, Sort: ${getSortLabel(sortBy)}`
          : "Filter & Sort"
      }
    >
      <Filter size={18} className={Styles.icon} />
      <span className={Styles.label}>Filter & Sort</span>
      {(hasFilters || hasCustomSort) && (
        <div className={Styles.indicators}>
          {hasFilters && (
            <span className={Styles.count}>
              {selectedCategories.length}
            </span>
          )}
          {hasCustomSort && (
            <span className={Styles.sortIndicator}>
              <ArrowUpDown size={12} />
            </span>
          )}
        </div>
      )}
    </button>
  );
}; 