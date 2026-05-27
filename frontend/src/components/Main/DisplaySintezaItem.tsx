import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { MdRefresh, MdHelpOutline } from 'react-icons/md';
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import useKeyPress from '../../hooks/useKeyPress';
import type { AskQuestion, FileD, FishierMaterie, Materie } from '../../scripts/objects';
import { FaFile, FaFilePdf, FaFilePowerpoint, FaFileWord } from 'react-icons/fa';
import axios from 'axios';
import { addr } from '../../scripts/network';
import AskQuestionPage from './AskQuestionPage';
import FilePlaceholder from '../Misc/FilePlaceholder';
import { FcImageFile } from 'react-icons/fc';
import { FaHtml5 } from "react-icons/fa";
import DisplaySintezaItemContentMarkdown from './DisplaySintezaItemContentMarkdown';
import { AiFillFileMarkdown } from "react-icons/ai";
import { getIsHtmlState, setIsHtmlState } from '../../scripts/aox';
import DisplaySintezaItemContentHTML from './DisplaySintezaItemContenHTML';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface ContainerProps {
  $fullscreen?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  transition: 
    border-radius 0.4s cubic-bezier(0.215, 0.610, 0.355, 1),
    box-shadow 0.4s cubic-bezier(0.215, 0.610, 0.355, 1),
    border 0.4s cubic-bezier(0.215, 0.610, 0.355, 1);
  will-change: transform, opacity;
  flex: none;
  ${(props) =>
    props.$fullscreen
      ? css`
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          border-radius: 0;
          border: none;
          box-shadow: none;
          z-index: 99999999;
        `
      : css`
          position: relative;
          border-radius: 12px;
          border: 1px solid #eaeef5;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          min-height: 0;
          flex: 1;
          &:hover {
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
            border-color: #d0d9e8;
          }
        `}
`;

const TopBar = styled.div`
  display: flex;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  height: 60px;
  padding: 0 10px;
  align-items: center;
  gap: 12px;
  z-index: 10;
  flex-shrink: 0;

  @media (max-width: 500px) {
    height: 40px;
    padding: 0 8px;
  }
`;

const Label = styled.h2`
  color: white;
  font-weight: 500;
  flex: 1;
  margin: 0;
  user-select: none;
  font-size: 18px;
  letter-spacing: 0.25px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

const ZoomContainer = styled.div`
  border-radius: 5px;
  width: 80px;
  height: 38px;
  background-color: rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 26px;
  user-select: none;

  @media (max-width: 500px) {
    display: none;
  }
`;

const ZoomControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 500px) {
    display: none;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
    color: white;
  }

  &:active {
    transform: scale(0.92);
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 500px) {
    width: 30px;
    height: 30px;
    border-radius: 6px;
  }
`;

const RefreshIcon = styled(MdRefresh)<{ $isRefreshing: boolean }>`
  transition: transform 0.3s ease;
  ${({ $isRefreshing }) =>
    $isRefreshing &&
    css`
      animation: ${rotate} 0.8s linear infinite;
    `}
`;

const StatusIndicator = styled.div<{ $isGenerating: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isGenerating ? '#f59e0b' : '#10b981')};
  margin-left: 8px;
  box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
  animation: ${(props) =>
    props.$isGenerating ? css`pulse 1.5s infinite ease-in-out` : 'none'};

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
    70% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
    100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  min-width: 0;
  align-items: center;
`;

const FileMeta = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
  margin-left: 12px;
  background: rgba(0, 0, 0, 0.15);
  padding: 2px 8px;
  border-radius: 20px;
  flex-shrink: 0;

  @media (max-width: 500px) {
    font-size: 11px;
    margin-left: 8px;
    padding: 2px 6px;
  }
`;

const Icon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 5px;
  background-color: #fff;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 500px) {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

// Main component
export default function DisplaySintezaItem({
  AskQustionOutput,
  materie,
  selected,
  setError,
  file,
}: {
  AskQustionOutput: AskQuestion;
  materie: Materie;
  selected: FileD | null;
  setError: Function;
  file: FishierMaterie | null;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalPositionRef = useRef<DOMRect | null>(null);
  const [Zoom, setZoom] = useState<number>(100);
  const [IsAskingQuestion, setIsAskingQuestion] = useState<boolean>(false);
  const [IsHtml, setIsHtml] = useState<boolean>(() => getIsHtmlState());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsHtmlState(IsHtml);
    }
  }, [IsHtml]);

  useEffect(() => {
    setIsOpen(true);
  }, [selected]);

  useEffect(() => {
    setIsHtmlState(getIsHtmlState());
  }, []);

  useEffect(() => {
    const newValue = file ? file.is_computing : false;
    if (newValue !== isGenerating) {
      setIsGenerating(newValue);
    }
  }, [file]);

  const toggleFullscreen = () => {
    if (!isFullScreen && containerRef.current) {
      originalPositionRef.current = containerRef.current.getBoundingClientRect();
    }
    setIsFullScreen((prev) => !prev);
  };

  useKeyPress('Escape', () => {
    if (isFullScreen && !IsAskingQuestion) {
      setIsFullScreen(false);
    }
  });

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0';
      setIsOpen(true);
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [isFullScreen]);

  const startSynthesisGeneration = async () => {
    if (!file) return;

    setIsGenerating(true);
    try {
      let path = `${addr}/genereaza_sinteza`;
      if (file.sinteza !== null) {
        path = `${addr}/regenereaza_sinteza`;
      }

      const response = await axios.post(path, {
        name_materie: materie.name,
        file_name: file.path.split('/').pop() || file.path,
      });

      if (response.data === 'y') {
        console.log('Synthesis generation started successfully');
      } else {
        console.error('Failed to start synthesis generation');
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Error starting synthesis generation:', error);
      setIsGenerating(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  if (file === null) return null;

  const nameSegments = file.path.split('/');
  const fileName = nameSegments.length > 1 ? nameSegments[nameSegments.length - 1] : file.path;
  const cleanName = fileName.split('.').slice(0, -1).join('.') || fileName;
  let tip: string = file.path.split(".").length > 0 
    ? file.path.split('.')[file.path.split(".").length - 1] 
    : "null";

  if (selected === null) return <FilePlaceholder />;

  if (IsAskingQuestion) {
    return (
      <AskQuestionPage
        AskQustionOutput={AskQustionOutput}
        setError={setError}
        onClose={() => setIsAskingQuestion(false)}
        file={file}
      />
    );
  }

  return (
    <Container ref={containerRef} $fullscreen={isFullScreen}>
      <TopBar>
        <FileInfo>
          <Icon>
            {tip === "null" ? <FaFile size={22} /> : null}
            {tip.toLowerCase() === "pdf" ? <FaFilePdf size={18} color="#E52E2E" /> : null}
            {tip.toLowerCase() === "doc" || tip.toLowerCase() === "docx" ? (
              <FaFileWord size={18} color="#2B579A" />
            ) : null}
            {tip.toLowerCase() === "ppt" || tip.toLowerCase() === "pptx" ? (
              <FaFilePowerpoint size={16} color="#D24726" />
            ) : null}
            {tip.toLowerCase() === "jpg" || tip.toLowerCase() === "jpeg" || tip.toLowerCase() === "png" ? (
              <FcImageFile size={18} />
            ) : null}
          </Icon>
          <Label title={cleanName}>{cleanName}</Label>
          {file.sinteza ? (
            <StatusIndicator $isGenerating={isGenerating} />
          ) : (
            <FileMeta>No synthesis</FileMeta>
          )}
        </FileInfo>

        {file.sinteza !== null && file.is_computing === false && (
          <ZoomControls>
            <Button onClick={() => setZoom((prev) => Math.max(20, prev - 20))}>
              <ZoomOut size={24} />
            </Button>
            <ZoomContainer>{Zoom}</ZoomContainer>
            <Button onClick={() => setZoom((prev) => Math.min(200, prev + 20))}>
              <ZoomIn size={24} />
            </Button>
          </ZoomControls>
        )}

        <Button onClick={() => setIsHtml((prev) => !prev)} aria-label="generare html">
          {!IsHtml ? <FaHtml5 size={24} /> : <AiFillFileMarkdown size={24} />}
        </Button>

        {file.sinteza !== null && (
          <Button onClick={() => setIsAskingQuestion(true)} aria-label="Ask question">
            <MdHelpOutline size={24} />
          </Button>
        )}

        <Button onClick={toggleFullscreen} aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}>
          {!isFullScreen ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
        </Button>

        <Button
          onClick={startSynthesisGeneration}
          aria-label={file.sinteza ? "Refresh synthesis" : "Generate synthesis"}
          disabled={isRefreshing || isGenerating}
        >
          <RefreshIcon size={20} $isRefreshing={isRefreshing || isGenerating} />
        </Button>
      </TopBar>

      {IsHtml ? (
        <DisplaySintezaItemContentHTML
          file={file}
          Zoom={Zoom}
          isFullScreen={isFullScreen}
          isOpen={isOpen}
          isGenerating={isGenerating}
          startSynthesisGeneration={startSynthesisGeneration}
        />
      ) : (
        <DisplaySintezaItemContentMarkdown
          file={file}
          Zoom={Zoom}
          isFullScreen={isFullScreen}
          isOpen={isOpen}
          isGenerating={isGenerating}
          startSynthesisGeneration={startSynthesisGeneration}
        />
      )}
    </Container>
  );
}
