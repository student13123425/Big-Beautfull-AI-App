import { useEffect, useCallback } from 'react';

interface UseArrowKeysAdvancedProps {
  onLeftArrow: () => void;
  onRightArrow: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
  ignoreInputFields?: boolean;
  target?: HTMLElement | Document;
}

/**
 * Advanced React hook that listens for left and right arrow key presses
 * with configurable options for behavior and target element.
 * 
 * @param onLeftArrow - Function to execute when left arrow key is pressed
 * @param onRightArrow - Function to execute when right arrow key is pressed
 * @param enabled - Whether the hook should be active (default: true)
 * @param preventDefault - Whether to prevent default browser behavior (default: true)
 * @param ignoreInputFields - Whether to ignore arrow keys in input fields (default: true)
 * @param target - Element to attach event listener to (default: document)
 */
const useArrowKeysAdvanced = ({
  onLeftArrow,
  onRightArrow,
  enabled = true,
  preventDefault = true,
  ignoreInputFields = true,
  target = document
}: UseArrowKeysAdvancedProps): void => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Early return if disabled or event already handled
    if (!enabled || event.defaultPrevented) {
      return;
    }

    // Check if we should ignore input fields
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

    // Handle arrow key presses
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

    // Add event listener to the specified target
    target.addEventListener('keydown', handleKeyDown as EventListener);

    // Cleanup function to remove event listener
    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [handleKeyDown, enabled, target]);
};

export default useArrowKeysAdvanced;