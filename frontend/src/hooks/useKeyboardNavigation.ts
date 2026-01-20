import { useEffect } from 'react';

export const useKeyboardNavigation = (
  currentPage: number,
  totalPages: number,
  goToPage: (pageNum: number) => void
): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        goToPage(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
    };

    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Clean up the event listener on unmount
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages, goToPage]);
};
