import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { MdSend, MdHelpOutline, MdClose, MdRefresh, MdInfoOutline } from 'react-icons/md';
import { FaFileAlt } from 'react-icons/fa';
import { AskQuestion, type FileD, type FishierMaterie } from '../../scripts/objects';
import useKeyPress from '../../hooks/useKeyPress';
import { AskDocumentQuestion, stopAnsweringQuestion } from '../../scripts/network';
import type Markdown from 'markdown-to-jsx';
import MarkdownRenderer from '../Misc/MarkdownRenderer';
import { extractContent } from '../../scripts/aox';

// Animation keyframes
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
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div<{ $fullscreen: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
  animation: ${scaleIn} 0.3s ease-out;
  will-change: transform, opacity;
  
  ${({ $fullscreen }) => $fullscreen 
    ? css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        border-radius: 0;
        z-index: 9999;
      `
    : css`
        position: relative;
        border-radius: 12px;
        border: 1px solid #eaeef5;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        width: 100%;
        height: 600px;
        margin: 20px 0;
        
        &:hover {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
          border-color: #d0d9e8;
        }
      `}
`;

const TopBar = styled.div`
  display: flex;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  height: 60px;
  padding: 0 16px;
  align-items: center;
  gap: 12px;
  z-index: 10;
  flex-shrink: 0;
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
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #f8fafc;
  overflow: hidden;
  padding: 24px;
  gap: 24px;
`;

const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
`;

const DocumentIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: #ede9fe;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7c3aed;
  flex-shrink: 0;
`;

const DocumentDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const DocumentTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1e293b;
`;

const DocumentType = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QuestionLabel = styled.label`
  font-weight: 500;
  color: #334155;
  font-size: 16px;
`;

const QualityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const QualityLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
`;

const QualityOptions = styled.div`
  display: flex;
  gap: 10px;
`;

const QualityOption = styled.button<{ $selected: boolean }>`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.$selected ? '#7c3aed' : '#cbd5e1'};
  background: ${props => props.$selected ? '#f5f3ff' : 'white'};
  color: ${props => props.$selected ? '#7c3aed' : '#64748b'};
  font-weight: ${props => props.$selected ? '500' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  &:hover {
    border-color: #8b5cf6;
    background: #f5f3ff;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QualityIndicator = styled.div<{ $quality: number }>`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    #10b981 ${props => props.$quality >= 0 ? '33%' : '0%'},
    #f59e0b ${props => props.$quality >= 0 ? '33%' : '0%'} 
              ${props => props.$quality >= 1 ? '66%' : '33%'},
    #ef4444 ${props => props.$quality >= 1 ? '66%' : '33%'}
  );
  margin-top: 8px;
`;

const Tooltip = styled.div`
  position: absolute;
  top: -30px;
  background: #334155;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transform: translateY(5px);
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px 5px 0;
    border-style: solid;
    border-color: #334155 transparent transparent;
  }
  
  ${QualityOption}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Input = styled.input`
  flex: 1;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  padding: 18px;
  font-size: 16px;
  max-height: 50px;
  resize: none;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const SubmitButton = styled.button<{ $isProcessing: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  font-weight: 500;
  font-size: 15px;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.25);
  }
  
  &:active {
    transform: scale(0.96);
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StopButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-weight: 500;
  font-size: 15px;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.25);
  }
  
  &:active {
    transform: scale(0.96);
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const AnswerContainer = styled.div<{ $hasAnswer: boolean }>`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  opacity: ${props => props.$hasAnswer ? 1 : 0.5};
  transition: all 0.3s ease;
`;

const AnswerLabel = styled.div`
  padding: 10px;
  font-weight: 500;
  color: #64748b;
  font-size: 15px;
  font-size: 18px;
  background-color:#0001;
`;

const AnswerContent = styled.div`
  flex: 1;
  line-height: 1.6;
  color: #334155;
  animation: ${fadeIn} 0.4s ease;
  overflow: auto;
    &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const StatusIndicator = styled.div<{ $isProcessing: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isProcessing ? '#f59e0b' : '#10b981'};
  margin-left: 8px;
  box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
  animation: ${props => props.$isProcessing 
    ? css`pulse 1.5s infinite ease-in-out` 
    : 'none'};
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
    70% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
    100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
  }
`;

const EmptyAnswer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  font-style: italic;
`;

// Main component
interface AIAssistantProps {
    file:FishierMaterie,
  onClose: () => void;
  setError:Function;
  AskQustionOutput:AskQuestion
}

export default function AskQuestionPage({ 
  file,
  onClose,
  setError,
  AskQustionOutput
}: AIAssistantProps) {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useKeyPress('Escape', () => {
    stopAnsweringQuestion(setError);
    onClose();
  });
  
  useEffect(()=>{
    if(AskQustionOutput.content==null)
      return;
    let value=extractContent(AskQustionOutput.content)
    if(value!=null)
      setAnswer(value);
    else
      setAnswer("")
  },[AskQustionOutput.content])
  
  useEffect(()=>{
    setIsProcessing(AskQustionOutput.is_computing);
  },[AskQustionOutput.is_computing])
  
  const  handleSubmit = async () => {
    await AskDocumentQuestion(question, file.materie, file.path, 2, setError);
    setIsProcessing(true);
    setAnswer('');
  };
  useKeyPress("Enter", handleSubmit);
  
  const handleClear = () => {
    setQuestion('');
    setAnswer('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const handleStop = () => {
    stopAnsweringQuestion(setError);
    setIsProcessing(false);
  };

  return (
    <Container $fullscreen={true}>
      <TopBar>
        <Label>Document Assistant</Label>
        {onClose && (
          <Button 
            onClick={()=>{
              stopAnsweringQuestion(setError);
              onClose()
            }}
            aria-label="Close assistant"
          >
            <MdClose size={22} />
          </Button>
        )}
      </TopBar>
      
      <ContentContainer>
        <DocumentInfo>
          <DocumentIcon>
            <FaFileAlt size={20} />
          </DocumentIcon>
          <DocumentDetails>
            <DocumentTitle>{file.path.split("/").length>1?file.path.split("/").pop():file.path}</DocumentTitle>
            <DocumentType>{file.path.split(".").length>1?file.path.split(".").pop():file.path} Document</DocumentType>
          </DocumentDetails>
          <StatusIndicator $isProcessing={isProcessing} />
        </DocumentInfo>
        
        <InputContainer>
          <QuestionLabel>Ask a question about this document</QuestionLabel>
          
          <Input
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What information are you looking for?"
            rows={4}
            disabled={isProcessing}
          />
          
          <ButtonContainer>
         
            {isProcessing?(
              <StopButton 
                onClick={handleStop}
                disabled={!isProcessing}
              >
                <MdClose size={18} />
                Stop
              </StopButton>
            ):(
                <SubmitButton 
                  onClick={handleClear}
                  disabled={isProcessing || (!question && !answer)}
                  $isProcessing={false}
                >
                  Clear
                </SubmitButton>
            )}
            <SubmitButton 
              onClick={handleSubmit}
              disabled={!question.trim() || isProcessing}
              $isProcessing={isProcessing}
            >
              {isProcessing ? (
                <>
                  <MdRefresh size={18} style={{ animation: 'spin 1s linear infinite' }} /> 
                  Processing...
                </>
              ) : (
                <>
                  <MdSend size={18} /> 
                  Ask Question
                </>
              )}
            </SubmitButton>
          </ButtonContainer>
        </InputContainer>
        
        <AnswerContainer $hasAnswer={!!answer}>
          <AnswerLabel>Answer</AnswerLabel>
          <AnswerContent>
            {answer!==null?<MarkdownRenderer content={answer} zoom={1}/> :(
              <EmptyAnswer>
                {isProcessing 
                  ? "Analyzing document and preparing answer..." 
                  : "Submit a question to get insights from the document"}
              </EmptyAnswer>
            )}
          </AnswerContent>
        </AnswerContainer>
      </ContentContainer>
    </Container>
  );
}