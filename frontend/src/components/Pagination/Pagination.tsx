import React from "react";
import Styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading = false,
  showInfo = false,
  totalItems,
  itemsPerPage
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const getCurrentRangeInfo = () => {
    if (!totalItems || !itemsPerPage) return null;
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    
    return { start, end };
  };

  const rangeInfo = getCurrentRangeInfo();

  return (
    <div className={Styles.paginationContainer}>
      {showInfo && rangeInfo && (
        <div className={Styles.paginationInfo}>
          Showing {rangeInfo.start}-{rangeInfo.end} of {totalItems} items
        </div>
      )}
      
      <div className={Styles.pagination}>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`${Styles.paginationButton} ${Styles.prevNext}`}
          aria-label="Previous page"
        >
          ← Previous
        </button>
        
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
            disabled={isLoading || page === '...'}
            className={`${Styles.paginationButton} ${
              page === currentPage ? Styles.active : ''
            } ${page === '...' ? Styles.ellipsis : ''}`}
            aria-label={typeof page === 'number' ? `Go to page ${page}` : 'More pages'}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`${Styles.paginationButton} ${Styles.prevNext}`}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    </div>
  );
}; 