import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { MdClose, MdError } from 'react-icons/md';
import type { AiServerError } from '../../scripts/objects';
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
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  height: 60px;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 499px) {
    flex: 1;
    overflow-y: auto;
  }
`;

const ErrorContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const ErrorIcon = styled.div`
  color: #ef4444;
  flex-shrink: 0;
  margin-top: 3px;
`;

const ErrorMessage = styled.div`
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f8fafc;
`;

const ActionButton = styled.button`
  padding: 10px 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  @media (max-width: 499px) {
    flex:1;
  }
  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
  }
  
  &:active {
    transform: scale(0.96);
  }
  
  &:focus {
    outline: 2px solid rgba(239, 68, 68, 0.4);
  }
`;

interface ErrorModalProps {
  onClose: () => void;
  error: AiServerError;
}

export default function ErrorModal({ onClose, error }: ErrorModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 250);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  useKeyRelease("Escape",()=>handleClose())
  if (!error.active) return null;
  return (
    <Overlay 
      $closing={isClosing} 
      onClick={isSmallScreen ? undefined : handleClose}
    >
      <ModalContainer 
        $closing={isClosing}
        onClick={e => e.stopPropagation()}
      >
        <ModalTopBar>
          <ModalTitle>
            <MdError size={24} />
            {error.title || "Error"}
          </ModalTitle>
          <CloseButton 
            onClick={handleClose} 
            aria-label="Close"
          >
            <MdClose size={24} />
          </CloseButton>
        </ModalTopBar>
        
        <ContentArea>
          <ErrorContent>
            <ErrorIcon>
              <MdError size={24} />
            </ErrorIcon>
            <ErrorMessage>
              {error.content || "An unexpected error occurred."}
            </ErrorMessage>
          </ErrorContent>
        </ContentArea>
        
        <ButtonContainer>
          <ActionButton onClick={handleClose} autoFocus>
            OK
          </ActionButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
}