import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes, css } from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';
import { getTopLevePath } from '../../scripts/aox';
import type { AiModel } from '../../scripts/objects';

const fadeInBottom = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOutBottom = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-8px); }
`;

const fadeInTop = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOutTop = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(8px); }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const SelectButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid ${({ $isOpen }) => ($isOpen ? 'rgba(59, 130, 246, 0.5)' : '#d1d5db')};
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ $isOpen }) =>
    $isOpen
      ? '0 0 0 3px rgba(59, 130, 246, 0.2)'
      : '0 1px 2px rgba(0, 0, 0, 0.05)'};

  &:hover {
    border-color: #9ca3af;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
`;

const IconWrapper = styled.span<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  color: #64748b;
  max-width: 2rem;
  margin-left: 0.75rem;
`;

const PortalOptionsList = styled.ul<{ $isClosing: boolean; $placement: 'top' | 'bottom'; $top: number; $left: number; $width: number }>`
  position: fixed;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  pointer-events: auto;
  list-style: none;
  max-height: 280px;
  overflow-y: auto;
  padding: 0.5rem 0;

  top: ${({ $top }) => $top}px;
  transform-origin: center top;

  animation: ${fadeInBottom} 0.25s ease-out forwards;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f8fafc;
  }
`;

const OptionItem = styled.li<{ $isSelected: boolean }>`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
  user-select: none;

  &:hover {
    background-color: #f1f5f9;
  }

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: #eff6ff;
      color: #1d4ed8;
      font-weight: 600;
    `}
`;

interface AnimatedDropdownProps {
  options: AiModel[] | string[];
  onSelect: (option: string) => void;
  selectedOption: string | null;
  placeholder?: string;
}

interface NormalizedOption {
  value: string;
  label: string;
}

const DropdownPortalContent: React.FC<{
  isOpen: boolean;
  isClosing: boolean;
  placement: 'top' | 'bottom';
  normalizedOptions: NormalizedOption[];
  selectedOption: string | null;
  buttonRect: DOMRect | null;
  onSelect: (value: string) => void;
}> = ({ isOpen, isClosing, placement, normalizedOptions, selectedOption, buttonRect, onSelect }) => {
  if (!isOpen || !buttonRect) return null;

  const dropdownHeight = 280 + 16;
  let topPosition: number;

  if (placement === 'top') {
    topPosition = buttonRect.top - dropdownHeight;
  } else {
    topPosition = buttonRect.bottom;
  }

  return createPortal(
    <PortalOptionsList data-dropdown-portal="true" $isClosing={isClosing} $placement={placement} $top={topPosition} $left={buttonRect.left} $width={buttonRect.width}>
      {normalizedOptions.map((option, index) => (
        <OptionItem
          key={`portal-${option.value}-${index}`}
          onClick={() => onSelect(option.value)}
          $isSelected={option.value === selectedOption}
          role="option"
          aria-selected={option.value === selectedOption}
        >
          {option.label}
        </OptionItem>
      ))}
    </PortalOptionsList>,
    document.body
  );
};

const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({
  options,
  onSelect,
  selectedOption,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const normalizedOptions = useMemo<NormalizedOption[]>(() => {
    if (!Array.isArray(options)) {
      console.error(
        `AnimatedDropdown Error: The "options" parameter is invalid. Expected an array, but received type: ${typeof options}`
      );
      return [];
    }

    return options.reduce((acc, option, index) => {
      if (option === undefined || option === null) {
        console.warn(
          `AnimatedDropdown Warning: The "options" parameter contains a null/undefined value at index ${index}. Skipping.`
        );
        return acc;
      }

      if (typeof option === 'string') {
        acc.push({ value: option, label: option });
      } else {
        const model = option as AiModel;
        if (!model || typeof model !== 'object' || !('path' in model)) {
          console.error(
            `AnimatedDropdown Error: The "options" parameter contains an invalid object at index ${index}. Missing required "path" property. Value:`,
            option
          );
          return acc;
        }
        acc.push({ value: model.path, label: getTopLevePath(model.path) });
      }
      return acc;
    }, [] as NormalizedOption[]);
  }, [options]);

  const selectedLabel = useMemo(() => {
    if (selectedOption === null) return placeholder;
    const foundOption = normalizedOptions.find(opt => opt.value === selectedOption);
    return foundOption ? foundOption.label : placeholder;
  }, [selectedOption, normalizedOptions, placeholder]);

  const calculatePlacement = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 300; 

      if (spaceBelow < dropdownHeight && rect.top > spaceBelow) {
        setPlacement('top');
      } else {
        setPlacement('bottom');
      }
    }
  }, []);

  const closeDropdown = useCallback(() => {
    if (!isOpen) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const portalElement = document.body.querySelector('[data-dropdown-portal="true"]');
        if (portalElement && portalElement.contains(event.target as Node)) {
          return;
        }
        closeDropdown();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, closeDropdown]);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
    } else {
      if (buttonRef.current) {
        setButtonRect(buttonRef.current.getBoundingClientRect());
      }
      calculatePlacement();
      setIsOpen(true);
    }
  }, [isOpen, closeDropdown, calculatePlacement]);

  const handleSelect = useCallback((value: string) => {
    onSelect(value);
    closeDropdown();
  }, [onSelect, closeDropdown]);

  return (
    <Container ref={dropdownRef}>
      <SelectButton 
        ref={buttonRef}
        $isOpen={isOpen} 
        onClick={toggleDropdown} 
        aria-haspopup="listbox" 
        aria-expanded={isOpen}
      >
        <span>{selectedLabel}</span>
        <IconWrapper $isOpen={isOpen}>
          <FaChevronDown size={12} />
        </IconWrapper>
      </SelectButton>
      {isOpen && (
        <DropdownPortalContent
          isOpen={isOpen}
          isClosing={isClosing}
          placement={placement}
          normalizedOptions={normalizedOptions}
          selectedOption={selectedOption}
          buttonRect={buttonRect}
          onSelect={handleSelect}
        />
      )}
    </Container>
  );
};

export default AnimatedDropdown;