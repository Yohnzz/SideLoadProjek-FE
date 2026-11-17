import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <nav
      aria-label="Navigasi Halaman"
      className={`flex items-center justify-center gap-1.5 select-none ${className}`}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Halaman Sebelumnya"
        className="w-9 h-9 rounded-[8px] border border-[#E5E7EB] bg-white text-[#171923] flex items-center justify-center hover:bg-[#F0F1F5] active:bg-[#E4E6EB] disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="w-8 h-9 flex items-center justify-center text-xs text-[#737887]"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={`page-${page}`}
            type="button"
            onClick={() => onPageChange(page as number)}
            className={`min-w-9 h-9 px-2 text-xs font-semibold rounded-[8px] transition-all duration-150 flex items-center justify-center ${
              isActive
                ? 'bg-[#2373FB] text-white shadow-xs'
                : 'bg-white border border-[#E5E7EB] text-[#171923] hover:bg-[#F0F1F5]'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Halaman Selanjutnya"
        className="w-9 h-9 rounded-[8px] border border-[#E5E7EB] bg-white text-[#171923] flex items-center justify-center hover:bg-[#F0F1F5] active:bg-[#E4E6EB] disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

