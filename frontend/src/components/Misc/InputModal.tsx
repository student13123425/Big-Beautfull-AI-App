import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { MdClose } from 'react-icons/md';
import useKeyRelease from '../../hooks/useKeyRelease';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const scaleIn = keyframes`
  from { 
    transform: scale(0.95);
    opacity: 0.9;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
`;

const scaleOut = keyframes`
  from { 
    transform: scale(1);
    opacity: 1;
  }
  to { 
    transform: scale(0.95);
    opacity: 0;
  }
`;

const Overlay = styled.div<{ $closing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} 0.3s ease-out;
  animation-fill-mode: forwards;
`;

const ModalContainer = styled.div<{ $closing: boolean }>`
  animation: ${({ $closing }) => ($closing ? scaleOut : scaleIn)} 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
  animation-fill-mode: forwards;
  min-width: 400px;
  max-width: 90vw;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #eaeef5;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media (max-width: 499px) {
    width: 100%;
    height: 100%;
    min-width: auto;
    max-width: none;
    border-radius: 0;
    border: none;
    box-shadow: none;
    display: flex;
    flex-direction: column;
  }
`;

const ModalTopBar = styled.div`
  display: flex;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  height: 60px;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  color: white;
  font-weight: 500;
  margin: 0;
  font-size: 18px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  &:active {
    transform: scale(0.92);
  }
`;

const ContentArea = styled.div`
  padding: 32px;
  background-color: #f8fafc;
  font-size: 15px;
  line-height: 1.6;
  color: #334155;
  border-bottom: 1px solid #eaeef5;

  @media (max-width: 499px) {
    flex: 1;
    overflow-y: auto;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-top: 16px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  color: #334155;
  background-color: white;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  background-color: #f8fafc;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  
  ${({ $primary }) => $primary 
    ? css`
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        &:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }
      ` 
    : css`
        background-color: #e2e8f0;
        color: #334155;
        &:hover {
          background-color: #cbd5e1;
        }
      `
  }
  
  @media (max-width: 499px) {
    flex:1;
  }

  &:active {
    transform: scale(0.96);
  }
  
  &:focus {
    outline: 2px solid ${({ $primary }) => $primary ? 'rgba(59, 130, 246, 0.4)' : 'rgba(203, 213, 225, 0.4)'};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

interface InputModalProps {
  onClose: (input: string | null) => void;
  title: string;
  content: string | React.ReactNode;
  placeholder?: string;
  defaultValue?: string;
}

export default function InputModal({ 
  onClose, 
  title, 
  content,
  placeholder = "Type something...",
  defaultValue = ""
}: InputModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleClose = (value: string | null) => {
    setIsClosing(true);
    setTimeout(() => onClose(value), 250);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      handleClose(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose(null);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  useKeyRelease("Escape",()=>handleClose(null))
  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end of text
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, []);

  return (
    <Overlay 
      $closing={isClosing} 
      onClick={isSmallScreen ? undefined : () => handleClose(null)}
    >
      <ModalContainer 
        $closing={isClosing}
        onClick={e => e.stopPropagation()}
      >
        <ModalTopBar>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton 
            onClick={() => handleClose(null)} 
            aria-label="Close"
          >
            <MdClose size={24} />
          </CloseButton>
        </ModalTopBar>
        
        <ContentArea>
          {content}
          <InputField
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        </ContentArea>
        
        <ButtonContainer>
          <ActionButton onClick={() => handleClose(null)}>
            Cancel
          </ActionButton>
          <ActionButton 
            $primary 
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
          >
            Submit
          </ActionButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
}