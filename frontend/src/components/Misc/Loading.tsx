import React from 'react';
import { getFileType } from '../../scripts/network';
import { FileText } from 'lucide-react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
  width: 100%;
  height: 100%;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  color: #334155; 
`;

const LoadingSpinner = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &::after {
    content: '';
    display: block;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: 4px solid #e2e8f0;
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PulsingIcon = styled(FileText)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
  @keyframes fadeIn {
    to { opacity: 1; }
  }
`;

const FilePathText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
  max-width: 80%;
  word-break: break-all;
  opacity: 0;
  animation: fadeIn 0.5s ease-in 0.2s forwards;
  @keyframes fadeIn {
    to { opacity: 1; }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

export default function Loading(props: { filePath: string }) {
  return (
    <LoadingContainer>
      <ContentWrapper>
        <LoadingSpinner>
          <PulsingIcon size={32} color="#3b82f6" />
        </LoadingSpinner>
        <LoadingText>Loading {getFileType(props.filePath).toUpperCase()}...</LoadingText>
        <FilePathText>{props.filePath}</FilePathText>
      </ContentWrapper>
    </LoadingContainer>
  );
}