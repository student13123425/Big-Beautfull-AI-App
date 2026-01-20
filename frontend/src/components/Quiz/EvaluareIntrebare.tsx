import React, { useEffect, useRef, useState } from 'react'
import type { AiTextCorection, AiTextCorectionElement, Quiz } from '../../scripts/objects'
import { styled, keyframes } from 'styled-components';
import { flattenArray, interpolateColors } from '../../scripts/aox';
import { clear_evaluare, submiForEvaluation } from '../../scripts/network';
import MarkdownRenderer from '../Misc/MarkdownRenderer';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 24px;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
  background-color: #f8fafc;
  border-radius: 0px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }
  
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
`;

const Group = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }
`;

const Title = styled.h1`
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.25px;
  background: linear-gradient(135deg, #334155, #1e293b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const IntrebareContainer = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SmallTitle = styled.h2`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.25px;
`;

const MarkdownContainer = styled.div`
  padding: 16px;
  width: 100%;
  background-color: #f8fafc;
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 15px;
  line-height: 1.6;
`;

const TopContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 8px;
`;

const Score = styled.div<{ $score: number }>`
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: white;
  border-radius: 8px;
  background: ${props => interpolateColors("#ef4444", "#22c55e", props.$score/100)};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const pulseAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const LoadingSkeleton = styled.div`
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
`;

const LoadingScore = styled(LoadingSkeleton)`
  height: 50px;
  width: 50px;
  border-radius: 8px;
`;

const LoadingTitle = styled(LoadingSkeleton)`
  height: 24px;
  width: 80%;
  margin-bottom: 12px;
`;

const LoadingContent = styled(LoadingSkeleton)`
  height: 100px;
  width: 100%;
  margin-top: 12px;
  border-radius: 8px;
`;

export default function EvaluareIntrebare(props: {it: AiTextCorection, i: number}) {
  const is_computing = props.it.is_computing;

  if (is_computing) {
    return (
      <IntrebareContainer key={`${props.it.cerinta_initiala}+${props.i}`}>
        <TopContent>
          <SmallTitle>{props.it.cerinta_initiala}</SmallTitle>
          <LoadingScore />
        </TopContent>
        <LoadingContent />
      </IntrebareContainer>
    );
  }

  return (
    <IntrebareContainer key={`${props.it.cerinta_initiala}+${props.i}`}>
      <TopContent>
        <SmallTitle>{props.it.cerinta_initiala}</SmallTitle>
        <Score $score={props.it.score}>{props.it.score}</Score>
      </TopContent>
      <MarkdownContainer>
        <MarkdownRenderer content={props.it.detailed_markdown} />
      </MarkdownContainer>
    </IntrebareContainer>
  );
}