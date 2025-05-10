// src/components/Common/Pagination/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  siblingCount = 1,
  showFirst = true,
  showLast = true 
}) => {
  // Generate array of page numbers to display
  const generatePageNumbers = () => {
    const delta = siblingCount;
    const range = [];
    const rangeWithDots = [];
    let l;

    // Always show first page
    range.push(1);

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always show last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const pages = generatePageNumbers();

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>Page {currentPage} of {totalPages}</span>
      </div>
      
      <div className="pagination-controls">
        {/* First page button */}
        {showFirst && (
          <button
            className="pagination-button pagination-nav"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            <ChevronsLeft size={18} />
          </button>
        )}

        {/* Previous page button */}
        <button
          className="pagination-button pagination-nav"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page numbers */}
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="pagination-dots">...</span>
            ) : (
              <button
                className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next page button */}
        <button
          className="pagination-button pagination-nav"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last page button */}
        {showLast && (
          <button
            className="pagination-button pagination-nav"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            <ChevronsRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;