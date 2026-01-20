import React, { useEffect, useRef } from 'react';
import type { AiTextCorectionElement, Quiz } from '../../scripts/objects';
import { styled } from 'styled-components';
import { flattenArray } from '../../scripts/aox';
import { submiForEvaluation, clear_evaluare } from '../../scripts/network';
import EvaluareIntrebare from './EvaluareIntrebare';

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

export default function QuizDisplayEvaluare({
  correction,
  quiz,
  Answers,
  setError
}: {
  correction: AiTextCorectionElement;
  quiz: Quiz;
  Answers: string[][];
  setError: Function;
}) {
  const isMounted = useRef(true);
  const evaluationInProgress = useRef(false);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout>(null);


  useEffect(() => {
    isMounted.current = true;
    evaluationInProgress.current = true;

    const evaluate = async () => {
      try {
        const raspunsuri = flattenArray<string>(Answers);
        await submiForEvaluation(quiz, raspunsuri, setError);
        evaluationInProgress.current = false;
        console.log("Evaluation completed successfully");
      } catch (error) {
        console.error("Evaluation failed:", error);
        evaluationInProgress.current = false;
        setError("An error occurred during evaluation.");
      }
    };

    evaluate();

    return () => {
      isMounted.current = false;
      
      // Clear any pending timeout
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }

      // Schedule cleanup with delay to handle React Strict Mode
      cleanupTimeoutRef.current = setTimeout(async () => {
        if (!isMounted.current && !evaluationInProgress.current) {
          try {
            await clear_evaluare(setError);
            console.log("Evaluation buffer cleared");
          } catch (error) {
            console.error("Failed to clear evaluation:", error);
          }
        }
      }, 300); // Short delay to distinguish between Strict Mode remounts
    };
  }, [quiz, Answers, setError]);

  // Final cleanup on actual unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Container>
      {correction.data.map((section, i) => (
        <Group key={i}>
          <Title>{section.title}</Title>
          {section.data.map((item, idx) => (
            <EvaluareIntrebare
              key={`${item.cerinta_initiala}-${idx}`}
              i={idx}
              it={item}
            />
          ))}
        </Group>
      ))}
    </Container>
  );
}