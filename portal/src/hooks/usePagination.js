import { useState, useMemo } from 'react';

export const usePagination = (items, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((items?.length || 0) / pageSize);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return items?.slice(start, end) || [];
  }, [items, currentPage, pageSize]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 if items change (e.g. search)
  useMemo(() => {
    setCurrentPage(1);
  }, [items?.length]);

  return {
    currentPage,
    totalPages,
    currentData,
    onPageChange,
    totalResults: items?.length || 0,
    pageSize
  };
};
