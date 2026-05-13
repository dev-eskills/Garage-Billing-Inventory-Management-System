import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalResults, 
  pageSize = 10 
}) => {
  if (totalPages <= 1) return null;

  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(currentPage - 2, 1);
      let end = Math.min(start + maxVisiblePages - 1, totalPages);
      
      if (end === totalPages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-gray-50 gap-4">
      <div className="text-sm text-gray-500 font-medium">
        Showing <span className="text-gray-900 font-bold">{startResult}</span> to <span className="text-gray-900 font-bold">{endResult}</span> of <span className="text-gray-900 font-bold">{totalResults}</span> results
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 px-2 rounded-md text-sm font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-[#2b5ae3] text-white shadow-md shadow-blue-100'
                  : 'text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
