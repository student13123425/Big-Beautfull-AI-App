import React from 'react';
import { css, styled } from 'styled-components';
import { FaExclamationTriangle, FaRedoAlt } from 'react-icons/fa';
import { ReGenerateNewQuiz } from '../../scripts/network';
import { QuiZRequestItem } from '../../scripts/objects';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 16px;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
  background-color: #f8fafc;
  border-radius: 0px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }
  
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
`;

const Footer = styled.div`
  background-color: white;
  padding: 10px;
  display: flex;
  height: 4rem;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);
`;

const FooterButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: none;
  outline: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  transition:0.1s linear background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
  
  &:active {
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
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
`;

const QuizHeader = styled.div`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 20px 24px;
  border-radius: 0px;
`;

const QuizTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #1e293b;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #fee2e2;
  margin-top: 24px;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fecaca 0%, #f87171 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  
  svg {
    color: #dc2626;
    font-size: 40px;
  }
`;

const ErrorTitle = styled.h2`
  color: #b91c1c;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  font-family: 'Inter', sans-serif;
`;

const ErrorMessage = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  text-align: left;
  max-width: 600px;
  margin: 20px 0;
  font-family: 'Fira Code', monospace;
  white-space: pre-wrap;
  color: #b45309;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface GlobalContainerProps {
  fullScreen?: boolean;
}

const GlobalContainer = styled.div<GlobalContainerProps>`
  display: flex;
  flex-direction: column;
  height: 100%;

          width: 100%;
          height: 100%;
`;

interface QuizErrorProps {
  errorMessage: string;
  quizName: string;
  setError:Function
  req:QuiZRequestItem
}

export default function QuizDisplayError({ errorMessage, quizName ,setError,req}: QuizErrorProps) {
  const handleRegenerate = () => {
    ReGenerateNewQuiz(req,setError)
  };
  return (
    <GlobalContainer fullScreen={false}>
      <QuizHeader>
        <QuizTitle>
          <FaExclamationTriangle size={24} />
          {quizName} - Generation Failed
        </QuizTitle>
      </QuizHeader>
      
      <Container>
        <ErrorState>
          <ErrorIcon>
            <FaExclamationTriangle size={40} />
          </ErrorIcon>
          
          <ErrorTitle>Quiz Generation Failed</ErrorTitle>
          
          <p>
            The Quiz Generated By The Ai Is Not Valid
          </p>
          
          <ErrorMessage>
            {errorMessage}
          </ErrorMessage>
          <ActionButton onClick={handleRegenerate}>
            <FaRedoAlt />
            Regenerate Quiz
          </ActionButton>
        </ErrorState>
      </Container>
    </GlobalContainer>
  );
}