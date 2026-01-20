import React from 'react';
import { styled, keyframes } from 'styled-components';
import { FaPlug } from 'react-icons/fa';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
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

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
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
`;

const ErrorCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  animation: ${scaleIn} 0.3s ease;
`;

const IconWrapper = styled.div`
  color: #3b82f6;
  font-size: 3rem;
  margin-bottom: 1.5rem;
  animation: ${pulse} 1.5s infinite;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #1e293b;
  margin-bottom: 1rem;
  font-weight: 600;
  animation: ${fadeIn} 0.3s ease;
`;

const Message = styled.p`
  color: #475569;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.4s ease;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
  animation: ${fadeIn} 0.5s ease;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface NetworkErrorProps {
  errorMessage: string;
}

const NetworkErrorPage: React.FC<NetworkErrorProps> = ({ errorMessage }) => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Container>
      <ErrorCard>
        <IconWrapper>
          <FaPlug />
        </IconWrapper>
        <Title>Connection Error</Title>
        <Message>
          {errorMessage || 'Unable to establish a connection to the server. Please check your network connection.'}
        </Message>
        <RetryButton onClick={handleRetry}>
          Try Again
        </RetryButton>
      </ErrorCard>
    </Container>
  );
};

export default NetworkErrorPage;