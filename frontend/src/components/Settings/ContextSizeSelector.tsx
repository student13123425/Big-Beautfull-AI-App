import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { clampNumber } from '../../scripts/aox';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const SelectorContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  height: 3rem;
  background: rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
`;

const Button = styled.button`
  width: 3rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  border: none;
  transition: all 0.2s ease;
  user-select: none;
  
  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.3);
    color: white;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  &:disabled {
    cursor: not-allowed;
    color: rgba(255, 255, 255, 0.4);
    background: transparent;
  }
`;

const Display = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  user-select: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: #1e40af;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
`;

const SubLabel = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  margin: 0;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.3s ease;
  font-weight: 300;
`;

interface ContextSizeSelectorProps {
  value: number;
  setValue: (value: number) => void;
  step: number;
  bounds: [number, number];
}

export default function ContextSizeSelector({
  value,
  setValue,
  step,
  bounds
}: ContextSizeSelectorProps) {
  const [min, max] = bounds;
  
  const handleDecrease = () => {
    const newValue = clampNumber(value - step, min, max);
    setValue(newValue);
  };

  const handleIncrease = () => {
    const newValue = clampNumber(value + step, min, max);
    setValue(newValue);
  };

  return (
    <Container>
      <SelectorContainer>
        <Button 
          onClick={handleDecrease} 
          disabled={value <= min}
          aria-label="Decrease context size"
        >
          <FaMinus size={14} />
        </Button>
        
        <Display>{value.toLocaleString()} Tokens</Display>
        
        <Button 
          onClick={handleIncrease} 
          disabled={value >= max}
          aria-label="Increase context size"
        >
          <FaPlus size={14} />
        </Button>
      </SelectorContainer>
      <SubLabel>
        Defines the maximum amount of information the AI can remember.
      </SubLabel>
    </Container>
  );
}
