import { useEffect, useRef } from 'react';

const useDocumentTitle = (title: string, retainOnUnmount = false) => {
  const defaultTitle = useRef(document.title);
  
  useEffect(() => {
    // Set new title if different from current
    if (document.title !== title) {
      document.title = title;
    }
    
    return () => {
      // Reset to default title on unmount if requested
      if (!retainOnUnmount) {
        document.title = defaultTitle.current;
      }
    };
  }, [title, retainOnUnmount]);
};

export default useDocumentTitle;