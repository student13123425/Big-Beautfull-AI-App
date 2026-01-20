import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { MdClose } from 'react-icons/md';

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
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} 0.3s cubic-bezier(0.33, 1, 0.68, 1);
  animation-fill-mode: forwards;
`;

const ModalContainer = styled.div<{ $closing: boolean }>`
  animation: ${({ $closing }) => ($closing ? scaleOut : scaleIn)} 0.35s cubic-bezier(0.33, 1, 0.68, 1);
  animation-fill-mode: forwards;
  width: 420px;
  max-width: 90vw;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.18),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 32px 32px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: rgba(203, 213, 225, 0.2);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  color: #64748b;
  z-index: 10;
  
  &:hover {
    background: rgba(203, 213, 225, 0.3);
    transform: rotate(90deg);
    color: #475569;
  }
  
  &:active {
    transform: scale(0.92) rotate(90deg);
  }
`;

const IconContainer = styled.div<{ $color: string }>`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  background: ${props => `linear-gradient(145deg, ${props.$color}15, ${props.$color}08)`};
  color: ${props => props.$color};
  font-size: 44px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  animation: ${scaleIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: 0.1s;
`;

const ModalTitle = styled.h2`
  color: #1e293b;
  font-weight: 700;
  margin: 0 0 16px 0;
  font-size: 26px;
  letter-spacing: -0.25px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #334155, #1e293b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Message = styled.div`
  color: #64748b;
  font-size: 17px;
  line-height: 1.65;
  margin-bottom: 36px;
  font-family: 'Inter', sans-serif;
  font-weight: 450;
  max-width: 85%;
`;

const ActionButton = styled.button`
  padding: 14px 42px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 16px rgba(59, 130, 246, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0.2), transparent);
    opacity: 0.4;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 
      0 6px 20px rgba(59, 130, 246, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.15) inset;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 
      0 2px 8px rgba(59, 130, 246, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }
  
  &:focus {
    outline: none;
    box-shadow: 
      0 0 0 3px rgba(59, 130, 246, 0.3),
      0 4px 16px rgba(59, 130, 246, 0.3);
  }
`;

interface AcknowledgeModalProps {
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  icon: React.ReactNode;
  iconColor: string;
}

export default function AcknowledgeModal({
  onClose,
  title,
  message,
  icon,
  iconColor
}: AcknowledgeModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <Overlay
      $closing={isClosing}
      onClick={handleClose}
    >
      <ModalContainer
        $closing={isClosing}
        onClick={e => e.stopPropagation()}
      >
        <CloseButton 
          onClick={handleClose} 
          aria-label="Close modal"
        >
          <MdClose size={24} />
        </CloseButton>
        
        <IconContainer $color={iconColor}>
          {icon}
        </IconContainer>
        
        <ModalTitle>{title}</ModalTitle>
        <Message>{message}</Message>
        
        <ActionButton onClick={handleClose}>
          OK
        </ActionButton>
      </ModalContainer>
    </Overlay>
  );
}