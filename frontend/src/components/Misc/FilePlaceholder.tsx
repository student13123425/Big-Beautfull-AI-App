import React from 'react';
import styled from 'styled-components';
import { FiFile } from 'react-icons/fi';
import { getNoSubjectSelectedText, type PlaceholderLanguage } from '../../lang/placeholders';

// Component props
type FilePlaceholderProps = {
  onClick?: () => void;
  message?: string;
  subtitle?: string;
  className?: string;
  language?: string;
};

const FilePlaceholder: React.FC<FilePlaceholderProps> = ({
  onClick,
  message,
  subtitle,
  className,
  language
}) => {
  const lang = (language as PlaceholderLanguage) || 'English';
  const placeholderTexts = getNoSubjectSelectedText(lang);
  
  const actualMessage = message || placeholderTexts.noFileSelected;
  const displaySubtitle = subtitle || placeholderTexts.noFileSelectedSubtitle;
  
  return (
    <Container
      onClick={onClick}
      $clickable={!!onClick}
      className={className}
      aria-label={onClick ? 'Select file' : 'File placeholder'}
    >
      <FileIcon />
      <Message>{actualMessage}</Message>
      <Subtitle>{displaySubtitle}</Subtitle>
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

const Subtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  color: #b3b3b3;
  user-select: none;
  text-align: center;
  width: 350px;
`;
