import React from 'react';
import { styled, keyframes } from 'styled-components';
import { FaWifi, FaRedo, FaDownload } from 'react-icons/fa';

// Animation keyframes
const subtlePulse = keyframes`
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.03); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { 
    transform: scale(0.98);
    opacity: 0.9;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  padding: 2rem;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #e2e8f0;
`;

const ErrorCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem 2.5rem;
  border-radius: 18px;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(59, 130, 246, 0.3);
  max-width: 560px;
  width: 100%;
  animation: ${scaleIn} 0.4s ease-out;
  backdrop-filter: blur(10px);
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
  animation: ${fadeIn} 0.4s ease;
`;

const LMStudioLogo = () => (
  <svg width="180" height="50" viewBox="0 0 180 50" fill="none">
    <path d="M30 15H20V35H30V30H25V25H30V20H25V15H30Z" fill="#3b82f6"/>
    <path d="M35 15V35H40V25H45V35H50V15H45V20H40V15H35Z" fill="#3b82f6"/>
    <path d="M60 15H55V35H65V30H60V15Z" fill="#3b82f6"/>
    <path d="M80 15H70L65 25L70 35H80L85 25L80 15ZM75 20H77.5L80 25L77.5 30H75L72.5 25L75 20Z" fill="#3b82f6"/>
    <path d="M95 15H90V30H95V25H100V35H90V40H105V15H100V20H95V15Z" fill="#3b82f6"/>
    <path d="M120 15H110V20H115V35H110V40H125V35H120V15Z" fill="#3b82f6"/>
    <path d="M140 15H135V25H130V15H125V35H130V30H135V35H140V15Z" fill="#3b82f6"/>
    <path d="M150 15V20H155V15H150ZM150 25V35H155V25H150Z" fill="#3b82f6"/>
    <path d="M165 15H160V35H165V25H170V35H175V15H170V20H165V15Z" fill="#3b82f6"/>
  </svg>
);

const IconWrapper = styled.div`
  color: #3b82f6;
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  animation: ${subtlePulse} 2.5s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1e40af;
  margin-bottom: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  animation: ${fadeIn} 0.5s ease;
`;

const Message = styled.p`
  color: #475569;
  font-size: 1.15rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  animation: ${fadeIn} 0.6s ease;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 1rem 2.2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  animation: ${fadeIn} 0.7s ease;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(59, 130, 246, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  box-shadow: none;
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

interface ServerErrorProps {
  errorMessage?: string;
}

const LMStudioConnectionError: React.FC<ServerErrorProps> = ({ 
  errorMessage = "We couldn't find the LM Studio server on your local network."
}) => {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleDownload = () => {
    window.open('https://lmstudio.ai/', '_blank');
  };

  return (
    <Container>
      <ErrorCard>
        <LogoContainer>
          <LMStudioLogo />
        </LogoContainer>
        
        <IconWrapper>
          <FaWifi />
        </IconWrapper>
        
        <Title>Server Connection Error</Title>
        
        <Message>
          {errorMessage}<br />
          Please ensure LM Studio is running with the local server enabled,<br />
          and that your device is connected to the same network.
        </Message>
        
        <ActionGroup>
          <PrimaryButton onClick={handleRetry}>
            <FaRedo /> Retry Connection
          </PrimaryButton>
          
          <SecondaryButton onClick={handleDownload}>
            <FaDownload /> Download LM Studio
          </SecondaryButton>
        </ActionGroup>
      </ErrorCard>
    </Container>
  );
};

export default LMStudioConnectionError;