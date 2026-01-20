import React, { useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';
import { getTopLevePath } from '../../scripts/aox';
import type { AiModel } from '../../scripts/objects';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-8px); }
`;

// Container with positioning and z-index
const Container = styled.div`
  position: relative;
  width: 100%;
  z-index: 99999999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

// Select button styling with conditional props
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
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
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

// Chevron icon with animation
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

// Options list with animation
const OptionsList = styled.ul<{ $isClosing: boolean }>`
  position: absolute;
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  list-style: none;
  max-height: 280px;
  overflow-y: auto;
  transform-origin: top center;
  animation: ${({ $isClosing }) =>
    $isClosing
      ? css`${fadeOut} 0.25s ease-out forwards`
      : css`${fadeIn} 0.25s ease-out forwards`};

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

// Option item with conditional styling
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

  z-index: 99999;
  ${({ $isSelected }) => $isSelected && css`
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

// Helper type for normalized options
interface NormalizedOption {
  value: string;
  label: string;
}

const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({
  options,
  onSelect,
  selectedOption,
  placeholder = "Select an option"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to common format
  const normalizedOptions = useMemo<NormalizedOption[]>(() => {
    return options.map(option => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      } else {
        return { value: option.path, label: getTopLevePath(option.path) };
      }
    });
  }, [options]);

  // Find selected option label
  const selectedLabel = useMemo(() => {
    if (selectedOption === null) return placeholder;
    
    const foundOption = normalizedOptions.find(
      opt => opt.value === selectedOption
    );
    
    return foundOption ? foundOption.label : placeholder;
  }, [selectedOption, normalizedOptions, placeholder]);

  // Close dropdown on click outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      closeDropdown();
    }
  }, []);

  // Handle closing animation
  const closeDropdown = () => {
    if (!isOpen) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      setIsOpen(true);
    }
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    closeDropdown();
  };

  return (
    <Container ref={dropdownRef}>
      <SelectButton
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
        <OptionsList
          role="listbox"
          $isClosing={isClosing}
        >
          {normalizedOptions.map((option, index) => (
            <OptionItem
              key={`${option.value}-${index}`}
              onClick={() => handleSelect(option.value)}
              $isSelected={option.value === selectedOption}
              role="option"
              aria-selected={option.value === selectedOption}
            >
              {option.label}
            </OptionItem>
          ))}
        </OptionsList>
      )}
    </Container>
  );
};

export default AnimatedDropdown;
