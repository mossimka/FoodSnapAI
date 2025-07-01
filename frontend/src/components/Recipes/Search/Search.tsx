import React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import Styles from "./Search.module.css";

//import Styles from "./Search.module.css";

interface SearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
}

export const Search: React.FC<SearchProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onSearchClear 
}) => {
  return (
    <div className={Styles.searchContainer}>
      <div className={Styles.searchWrapper}>
        <SearchIcon size={20} className={Styles.searchIcon} />
        <input
          type="text"
          placeholder="Search recipes, ingredients, or authors..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={Styles.searchInput}
        />
        {searchQuery && (
          <button
            onClick={onSearchClear}
            className={Styles.clearButton}
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
