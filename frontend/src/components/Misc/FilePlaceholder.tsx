import React from 'react';
import styled from 'styled-components';
import { FiFile } from 'react-icons/fi';
import { getNoSubjectSelectedText, type PlaceholderLanguage } from '../../lang/placeholders';

// Component props
type FilePlaceholderProps = {
  onClick?: () => void;
  message?: string;
  className?: string;
  language?: string;
};

const FilePlaceholder: React.FC<FilePlaceholderProps> = ({
  onClick,
  message,
  className,
  language
}) => {
  const actualMessage = message || (() => {
    const lang = (language as PlaceholderLanguage) || 'English';
    return getNoSubjectSelectedText(lang).noFileSelected;
  })();
  return (
    <Container
      onClick={onClick}
      $clickable={false}
      className={className}
      aria-label={onClick ? 'Select file' : 'File placeholder'}
    >
      <FileIcon />
      <Message>{actualMessage}</Message>
      {onClick && <ActionText>Click to select</ActionText>}
    </Container>
  );
};

export default FilePlaceholder;

// Styled components with static colors - matching Materie.tsx visual style
const Container = styled.div<{ $clickable: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  min-height: 0;
  width: 100%;
  height: 100%;
  border: none;

  &:hover {
    border-color: ${props => (props.$clickable ? '#000000' : 'transparent')};
    background-color: ${props => (props.$clickable ? '#f8f9fa' : 'transparent')};
    transform: ${props => (props.$clickable ? 'translateY(-2px)' : 'none')};
    box-shadow: ${props =>
      props.$clickable
        ? '0 6px 12px rgba(0, 0, 0, 0.08)'
        : 'none'};
  }
`;

const FileIcon = styled(FiFile)`
  font-size: 130px;
  margin-bottom: 16px;
  color: #b3b3b3;
  opacity: 0.8;
`;

const Message = styled.p`
  font-size: 28px;
  font-weight: 100;
  margin: 0;
  color: #b3b3b3;
  user-select: none;
  text-align: center;
  width: 350px;
`;

const ActionText = styled.span`
  font-size: 22px;
  font-weight: 600;
  color: #000000;
  user-select: none;
`;
