import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 24px;
  text-align: center;
`;

const SpinnerCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

const SpinnerText = styled.p`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin: 0;
`;

export default function LoadingSpinner() {
  return (
    <Container>
      <SpinnerCircle />
      <SpinnerText>Reasoning...</SpinnerText>
    </Container>
  );
}