import React from 'react';
import styled from 'styled-components';
import { FiFile } from 'react-icons/fi';

// Component props
type FilePlaceholderProps = {
  onClick?: () => void;
  message?: string;
  className?: string;
};

const FilePlaceholder: React.FC<FilePlaceholderProps> = ({
  onClick,
  message = 'No file selected',
  className
}) => {
  return (
    <Container
      onClick={onClick}
      $clickable={false}
      className={className}
      aria-label={onClick ? 'Select file' : 'File placeholder'}
    >
      <FileIcon />
      <Message>{message}</Message>
      {onClick && <ActionText>Click to select</ActionText>}
    </Container>
  );
};

export default FilePlaceholder;

// Styled components with static colors
const Container = styled.div<{ $clickable: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px 24px;
  border: 2px dashed ${props => (props.$clickable ? '#6c757d' : '#dee2e6')};
  border-radius: 12px;
  background-color: #ffffff;
  cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  text-align: center;
  box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: none;
flex: 1;
  &:hover {
    border-color: ${props => (props.$clickable ? '#000000' : '#dee2e6')};
    background-color: ${props => (props.$clickable ? '#f8f9fa' : '#ffffff')};
    transform: ${props => (props.$clickable ? 'translateY(-2px)' : 'none')};
    box-shadow: ${props =>
      props.$clickable
        ? '0 6px 12px rgba(0, 0, 0, 0.08)'
        : '0 4px 6px rgba(0, 0, 0, 0.03)'};
  }
`;

const FileIcon = styled(FiFile)`
  font-size: 64px;
  margin-bottom: 16px;
  color: #6c757d;
  opacity: 0.8;
`;

const Message = styled.p`
  font-size: 32px;
  font-weight: 500;
  margin: 0 0 8px;
  color: #353535;
  user-select: none;
`;

const ActionText = styled.span`
  font-size: 22px;
  font-weight: 600;
  color: #000000;
  user-select: none;
`;
