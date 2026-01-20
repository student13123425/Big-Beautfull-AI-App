import React, { useState, useRef, useEffect } from 'react';
import { styled } from 'styled-components';
import ItemIntrebare from './ItemIntrebare';
import type { GroupIntrebare } from '../../scripts/objects';
import { FiChevronDown } from 'react-icons/fi';
import { clone } from '../../scripts/aox';

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
`;

const SectionNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const SectionTitle = styled.h2`
  color: #1e293b;
  font-weight: 600;
  font-size: 20px;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.25px;
  background: linear-gradient(135deg, #334155, #1e293b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AnimatedContainer = styled.div<{ height: number }>`
  overflow: hidden;
  transition: 
    height 0.3s ease,
    opacity 0.2s ease 0.1s;
  height: ${({ height }) => height}px;
  opacity: ${({ height }) => height > 0 ? 1 : 0};
`;

const ContentWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }
`;

const CloseBTN = styled.div`
  cursor: pointer;
  margin-left: auto;
  transition: transform 0.3s ease;
`;

export default function QuizDisplaySection(props: {
  section: GroupIntrebare;
  index: number;
  setSelectedAnswers: Function;
  SelectedAnswers: boolean[][];
  setCorrectAnswers: Function;
  CorrectAnswrs: number[][];
  Answers:string[]
  setAnswers:Function
}) {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    if (!contentRef.current) return;
    
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
      }
    };
    
    updateHeight();
    
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(contentRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, props.section]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <>
      <SectionHeader>
        <SectionNumber>{props.index + 1}</SectionNumber>
        <SectionTitle>{props.section.title}</SectionTitle>
        <CloseBTN onClick={() => setIsOpen(!isOpen)}>
          <FiChevronDown 
            style={{ 
              transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease'
            }} 
            size={24} 
            color='#2563eb'
          />
        </CloseBTN>
      </SectionHeader>
      
      <AnimatedContainer height={contentHeight}>
        <ContentWrapper ref={contentRef}>
          {props.section.intrebari.map((question, j) => (
            <ItemIntrebare setAnswer={(it:string)=>{
              console.log(props.Answers);
              if(props.Answers===undefined){
                console.log("set failed");
                return;
              }
              const c:string[]=clone(props.Answers)
              c[j]=it
              props.setAnswers(c)
            }}
              setSelected={(input: boolean) => {
                props.setSelectedAnswers(prev => {
                  const newState = [...prev];
                  
                  if (!Array.isArray(newState[props.index])) {
                    newState[props.index] = Array(props.section.intrebari.length).fill(false);
                  } else {
                    newState[props.index] = [...newState[props.index]];
                  }
                  
                  newState[props.index][j] = input;
                  return newState;
                });
              }}
              isFailedSubmit={props.SelectedAnswers[props.index]?.[j] ?? false}
              setCorect={(input: number[]) => {
                props.setCorrectAnswers(prev => {
                  const newState = [...prev];
                  newState[props.index] = input;
                  return newState;
                });
              }}
              Corect={props.CorrectAnswrs[props.index] ?? []}
              key={question.id} 
              item={question} 
            />
          ))}
        </ContentWrapper>
      </AnimatedContainer>
    </>
  );
}