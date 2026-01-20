import React from 'react';
import styled from 'styled-components';
import { FaSearch, FaFileAlt, FaQuestionCircle } from 'react-icons/fa';

const Container = styled.div`
  width: 100%;
  height: 3.5rem; /* Reduced height for compactness */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem; /* Reduced padding */
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);

  @media (max-width: 500px) {
    padding: 0.2rem 0.4rem; /* Further reduced padding for mobile */
    height: 3rem; /* Smaller height for mobile */
  }
`;

const MenuItem = styled.div<{ $selected: boolean }>`
  position: relative;
  padding: 0.75rem 1.75rem;
  margin: 0 0.5rem;
  border-radius: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.25px;
  cursor: pointer;
  color: ${props => props.$selected ? '#1e40af' : 'rgba(255, 255, 255, 0.9)'};
  background: ${props => props.$selected 
    ? 'white' 
    : 'rgba(255, 255, 255, 0.15)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$selected 
    ? '0 2px 6px rgba(0,0,0,0.1)' 
    : 'none'};
  border: ${props => props.$selected 
    ? '1px solid rgba(59, 130, 246, 0.5)' 
    : 'none'};
  z-index: 1;
  min-width: 140px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.$selected 
      ? 'white' 
      : 'rgba(255, 255, 255, 0.25)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.$selected 
      ? '0 3px 8px rgba(0,0,0,0.15)' 
      : '0 2px 6px rgba(0,0,0,0.1)'};
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${props => props.$selected ? '80%' : '0'};
    height: 3px;
    background: #1e40af;
    border-radius: 2px;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  @media (max-width: 500px) {
    min-width: auto;
    width: 40px; /* Reduced width for mobile */
    height: 36px; /* Reduced height for mobile */
    padding: 0;
    margin: 0 0.25rem; /* Reduced margin for compactness */
    border-radius: 6px; /* Slightly smaller border radius */
    flex: 1;
  }

  user-select: none;
`;

const IconWrapper = styled.span<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.$selected ? '#1e40af' : 'rgba(255, 255, 255, 0.9)'};
  transition: color 0.2s ease;

  @media (min-width: 501px) {
    display: none;
  }

  @media (max-width: 500px) {
    font-size: 1rem; /* Reduced icon size for compactness */
  }
`;

const Text = styled.span<{ $selected: boolean }>`
  color: ${props => props.$selected ? '#1e40af' : 'rgba(255, 255, 255, 0.9)'};
  
  @media (max-width: 500px) {
    display: none;
  }
`;

export default function MaterieMenu(props: { 
  mode: number, 
  setMode: (mode: number) => void 
}) {
  const modes = [
    { 
      name: "Răsfoieste", 
      icon: <FaSearch />,
      ariaLabel: "Browse mode"
    },
    { 
      name: "Sinteza", 
      icon: <FaFileAlt />,
      ariaLabel: "Summary mode"
    },
    { 
      name: "Quiz", 
      icon: <FaQuestionCircle />,
      ariaLabel: "Quiz mode"
    }
  ];
  
  return (
    <Container>
      {modes.map((item, index) => (
        <MenuItem 
          key={index}
          $selected={props.mode === index}
          onClick={() => props.setMode(index)}
          role="button"
          aria-pressed={props.mode === index}
          aria-label={item.ariaLabel}
          title={item.name}
        >
          <IconWrapper $selected={props.mode === index}>
            {item.icon}
          </IconWrapper>
          <Text $selected={props.mode === index}>
            {item.name}
          </Text>
        </MenuItem>
      ))}
    </Container>
  );
}