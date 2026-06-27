import { useEffect, useRef } from 'react';

const useDocumentTitle = (title: string, retainOnUnmount = false) => {
  const defaultTitle = useRef(document.title);
  
  useEffect(() => {
    if (document.title !== title) {
      document.title = title;
    }
    
    return () => {
      if (!retainOnUnmount) {
        document.title = defaultTitle.current;
      }
    };
  }, [title, retainOnUnmount]);
};

export default useDocumentTitle;