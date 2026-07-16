import React, { useEffect, useState } from 'react';
import DocumentUpload from '../components/Misc/DocumentUpload';
import useDocumentTitle from '../hooks/useDocumentTitle';
import UploadImgGroup from '../components/Misc/UploadImgGroup';
import type { Materie } from '../scripts/objects';
import { styled, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;


const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;

  @media (max-width: 499px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
  }
`;

const Gap = styled.div`
  width: 100%;
  height: 4rem;
  flex-shrink: 0;
`;

const ToggleBar = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: center;

  @media (max-width: 499px) {
    padding: 1rem;
  }
`;

const ToggleBarInner = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 499px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
`;

const SubjectTitle = styled.h1`
  color: #fff;
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 499px) {
    font-size: 1.5rem;
    gap: 0.5rem;
  }
`;

const SubjectIcon = styled.div`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  backdrop-filter: blur(5px);

  @media (max-width: 499px) {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }
`;

const PathIndicator = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  display: inline-block;
  backdrop-filter: blur(5px);

  @media (max-width: 499px) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
  backdrop-filter: blur(5px);
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  color: ${props => props.$active ? '#1e293b' : 'rgba(255, 255, 255, 0.7)'};
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'};

  &:hover {
    background: ${props => props.$active ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.1)'};
  }

  @media (max-width: 499px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
`;

interface UploadPageProps {
  materie: Materie;
  onClose: () => void;
  language?: string;
  userId?: string | null;
}

type UploadType = 'document' | 'image';

const UploadPage: React.FC<UploadPageProps> = ({ materie, onClose, language, userId }) => {
  const [uploadType, setUploadType] = useState<UploadType>('document');

  useDocumentTitle(`AI App - Upload: ${materie.name}`);

  const basePath = userId 
    ? `./data/${userId}/${materie.name.toLowerCase()}`
    : `./data/${materie.name.toLowerCase()}`;
  const subjectInitial = materie.name.charAt(0).toUpperCase();

  return (
    <Container>
      <Gap />
      <ToggleBar>
        <ToggleBarInner>
          <>
            <div>
              <SubjectTitle>
                <SubjectIcon>{subjectInitial}</SubjectIcon>
                {materie.name}
              </SubjectTitle>
              <PathIndicator>Upload path: {basePath}</PathIndicator>
            </div>

            <ToggleGroup>
              <ToggleButton
                $active={uploadType === 'document'}
                onClick={() => setUploadType('document')}
              >
                📄 Document Upload
              </ToggleButton>
              <ToggleButton
                $active={uploadType === 'image'}
                onClick={() => setUploadType('image')}
              >
                🖼️ Image Upload
              </ToggleButton>
            </ToggleGroup>
          </>
        </ToggleBarInner>
      </ToggleBar>

      {uploadType === 'document' ? (
        <DocumentUpload
          materie={materie}
          onClose={onClose}
          language={language}
          userId={userId}
        />
      ) : (
        <UploadImgGroup
          materie={materie}
          onClose={onClose}
          language={language}
          userId={userId}
        />
      )}
    </Container>
  );
};

export default UploadPage;