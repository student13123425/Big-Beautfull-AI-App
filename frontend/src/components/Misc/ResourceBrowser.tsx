import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import type { FileD, Quiz, Materie } from '../../scripts/objects';
import FileUpload from './FileUpload';
import QuizCreatePage from '../Main/QuizCreatePage';
import BrowserItem from './BrowserItem';
import { useResizeBreakpoint } from '../../hooks/useResizeBreakpoint';

const slideInMobile = keyframes`
  from { transform: translateX(calc(-100vw + 60px)); }
  to { transform: translateX(0); }
`;

const slideOutMobile = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100vw + 60px)); }
`;

const Container = styled.div<{ $isExpanded: boolean; $animate: boolean }>`
  height: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  flex-shrink: 0;

  width: ${({ $isExpanded }) => ($isExpanded ? '300px' : '60px')};
  transition: width 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);

  @media (max-width: 500px) {
    position: fixed;
    top:7rem; /* Avoid overlap with navbar */
    left: 0;
    height: calc(100vh - 7rem); /* Full viewport minus navbar height */
    width: 100vw;
    border-right: none;

    transform: ${({ $isExpanded }) =>
      ($isExpanded ? 'translateX(0)' : 'translateX(calc(-100vw + 60px))')};

    transition: none;
    ${({ $isExpanded, $animate }) =>
      $animate &&
      css`
        animation: ${$isExpanded ? slideInMobile : slideOutMobile} 0.4s cubic-bezier(
          0.215,
          0.61,
          0.355,
          1
        );
      `}
  }
`;

const Header = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 16px;
  min-height: 50px;
`;

const Title = styled.h2<{ $isExpanded: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  transition: opacity 0.3s ease;
  user-select: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ToggleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  border: none;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
  min-width: 36px;
`;

const Content = styled.div<{ $isExpanded: boolean }>`
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  &::-webkit-scrollbar {
    display: none;
  }
  overflow-y: scroll;
  overflow-x: hidden;
  transition: opacity 0.3s ease;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  pointer-events: ${({ $isExpanded }) => ($isExpanded ? 'all' : 'none')};
`;

const AddButton = styled.button<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $isExpanded }) => ($isExpanded ? '10px' : '0')};
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  padding: ${({ $isExpanded }) => ($isExpanded ? '12px 16px' : '12px')};
  font-size: ${({ $isExpanded }) => ($isExpanded ? '15px' : '0')};
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s ease, transform 0.3s ease;
  margin-top: auto;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  margin-top: 15px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  pointer-events: ${({ $isExpanded }) => ($isExpanded ? 'auto' : 'none')};
  transform: translateY(${({ $isExpanded }) => ($isExpanded ? '0' : '20px')});
  height: 2.7rem !important;
  min-height: 2.7rem !important;
`;

const Hide = styled.div`
  display: none;
`;

interface ResourceBrowserProps {
  type: 'file' | 'quiz';
  materie: Materie;
  resourceList: (FileD | Quiz)[];
  onResourceDelete?: Function;
  setResource: Function;
  setError: Function;
  selectedResource: FileD | Quiz | null;
}

const MobileGap = styled.div`
  height: 100%;
  width: 60px;
  flex-shrink: 0;
`;

const ResourceBrowser: React.FC<ResourceBrowserProps> = ({
  type,
  materie,
  resourceList,
  setResource,
  setError,
  selectedResource
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IsMobile, setIsMobile] = useState<boolean>(false);
  const mobile_treshold: number = 500;

  useEffect(() => {
    setIsExpanded(true);
  }, [materie.name]);

  useEffect(() => {
    const w = window.innerWidth;
    setIsMobile(w < mobile_treshold);
  }, []);

  const handleToggle = () => {
    setShouldAnimate(true);
    setIsExpanded(!isExpanded);
  };
  useResizeBreakpoint(
    mobile_treshold,
    () => setIsMobile(true),
    () => setIsMobile(false)
  );

  return (
    <>
      {IsMobile && <MobileGap />}
      <Container $isExpanded={isExpanded} $animate={shouldAnimate}>
        <Header $isExpanded={isExpanded}>
          <Title title={materie.name} $isExpanded={isExpanded}>
            {materie.name}
          </Title>
          <ToggleButton
            onClick={handleToggle}
            aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            {isExpanded ? <BiChevronLeft size={24} /> : <BiChevronRight size={24} />}
          </ToggleButton>
        </Header>

        <Content $isExpanded={isExpanded}>
          {resourceList.map((resource, index) => (
            <BrowserItem
              key={`${type}-${index}`}
              type={type}
              item={resource}
              selectedItem={selectedResource}
              setError={setError}
              isOpen={isExpanded}
              setItem={(e: any) => {
                if(IsMobile)
                  setIsExpanded(false);
                setResource(e);
              }}
              materie_name={type === 'quiz' ? materie.name : undefined}
              list={type === 'file' ? materie.files : null}
            />
          ))}
        </Content>

        <AddButton
          onClick={() => setIsModalOpen(true)}
          $isExpanded={isExpanded}
          aria-label={type === 'file' ? 'Upload file' : 'Create quiz'}
        >
          <FaPlus size={22} />
          {isExpanded && (type === 'file' ? 'Add File' : 'Create Quiz')}
        </AddButton>

        {isModalOpen && type === 'file' ? (
          <FileUpload onClose={() => setIsModalOpen(false)} materie={materie} />
        ) : isModalOpen && type === 'quiz' ? (
          <QuizCreatePage
            materie={materie}
            setError={setError}
            QuizList={materie.quizs}
            files={materie.files}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <Hide />
        )}
      </Container>
    </>
  );
};

export default ResourceBrowser;
