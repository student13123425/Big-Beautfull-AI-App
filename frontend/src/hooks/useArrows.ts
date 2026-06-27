import { useEffect, useCallback } from 'react';

interface UseArrowKeysAdvancedProps {
  onLeftArrow: () => void;
  onRightArrow: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
  ignoreInputFields?: boolean;
  target?: HTMLElement | Document;
}

const useArrowKeysAdvanced = ({
  onLeftArrow,
  onRightArrow,
  enabled = true,
  preventDefault = true,
  ignoreInputFields = true,
  target = document
}: UseArrowKeysAdvancedProps): void => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || event.defaultPrevented) {
      return;
    }

    if (ignoreInputFields) {
      const eventTarget = event.target as HTMLElement;
      const isInputField =
        eventTarget.tagName === 'INPUT' ||
        eventTarget.tagName === 'TEXTAREA' ||
        eventTarget.contentEditable === 'true' ||
        eventTarget.isContentEditable;
      
      if (isInputField) {
        return;
      }
    }

    switch (event.key) {
      case 'ArrowLeft':
        if (preventDefault) {
          event.preventDefault();
        }
        onLeftArrow();
        break;
      case 'ArrowRight':
        if (preventDefault) {
          event.preventDefault();
        }
        onRightArrow();
        break;
    }
  }, [onLeftArrow, onRightArrow, enabled, preventDefault, ignoreInputFields]);

  useEffect(() => {
    if (!enabled || !target) {
      return;
    }

    target.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [handleKeyDown, enabled, target]);
};

export default useArrowKeysAdvanced;