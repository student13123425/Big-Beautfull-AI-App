import React, { useEffect, useState } from 'react';
import { css, styled } from 'styled-components';
import { AiTextCorectionElement, Quiz } from '../../scripts/objects';
import { 
  FaRegFileAlt, 
  FaListAlt, 
  FaQuestionCircle, 
  FaFileAlt 
} from 'react-icons/fa';
import { clone } from '../../scripts/aox';
import { Maximize2, Minimize2 } from 'lucide-react';
import QuizDIsplayRezultate from './QuizDIsplayRezultateGrila';
import useKeyPress from '../../hooks/useKeyPress';
import QuizDisplaySection from './QuizDisplaySection';
import QuizDisplayEvaluare from './QuizDisplayEvaluare';
import { clear_evaluare } from '../../scripts/network';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 16px;
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

const Footer = styled.div`
  background-color: white;
  padding: 10px;
  display: flex;
  height: 4rem;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);
`;

const FooterButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: none;
  outline: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  transition:0.1s linear background-color;
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
  
  &:active {
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0.2), transparent);
    opacity: 0.4;
    transition: opacity 0.3s ease;
  }
`;

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

const QuestionGroup = styled.div`
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  padding: 40px;
  
  svg {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.7;
  }
`;

const QuizHeader = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 20px 24px;
  border-radius: 0px;
`;

const QuizTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.5px;
  display: flex;
`;

const QuizMeta = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;
  font-size: 15px;
  opacity: 0.9;
`;  

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    font-size: 16px;
  }
`;

const ControlButton = styled.button<{ $active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${({ $active }) => ($active ? '#1e40af' : 'rgba(255, 255, 255, 0.15)')};
  outline: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left:auto;
  &:hover {
    background-color: ${({ $active }) => ($active ? '#1d4ed8' : 'rgba(255, 255, 255, 0.25)')};
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

interface GlobalContainerProps {
  fullScreen?: boolean;
}

const GlobalContainer = styled.div<GlobalContainerProps>`
  display: flex;
  flex-direction: column;

  ${({ fullScreen }) =>
    fullScreen
      ? css`
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index:1000;
        `
      : css`
          position: static;
          width: 100%;
          height: 100%;
        `}
`;

export default function QuizDisplay(props: {correction:AiTextCorectionElement, quiz: Quiz | null,setError:Function }) {
    const [CorrectAnswrs, setCorrectAnswers] = useState<number[][]>([]);
    const [Answrs, setAnswers] = useState<string[][]>([]);
    const [IsFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [IsShowRezolut, setIsShowRezout] = useState<boolean>(false);
    const [SelectedAnswers, setSelectedAnswers] = useState<boolean[][]>([]);
    const is_grila: boolean = props.quiz?.is_grila !== undefined ? props.quiz?.is_grila : false;
    useKeyPress('Escape', () => setIsFullscreen(false));
    useEffect(() => {
        if (props.quiz) {     
            let new_answers=props.quiz.intrebari.map(section => Array(section.intrebari.length).fill(''));
            setAnswers(new_answers);
            setCorrectAnswers(props.quiz.intrebari.map(section => []));
            setSelectedAnswers(
                props.quiz.intrebari.map(section => 
                    section.intrebari.map(() => false)
                )
            );
            setIsShowRezout(false);
        } else {
            setCorrectAnswers([]);
            setSelectedAnswers([]);
            setAnswers([]);
        }
    }, [props.quiz]);
    useEffect(()=>{
      return ()=>{
        clear_evaluare(props.setError);
      }
    },[])
    const handleSetAnswers = (index: number,it: string[]) => {
        setAnswers(prev => {
            const newAnswers = clone(prev);
            newAnswers[index] = clone(it);
            return newAnswers;
        });
    };
    if (!props.quiz) {
        return (
            <Container>
                <EmptyState>
                    <FaRegFileAlt size={48} />
                    No quiz selected
                    <div style={{ fontSize: 14, marginTop: 8 }}>
                        Select or generate a quiz to view questions
                    </div>
                </EmptyState>
            </Container>
        );
    }

    const quiz = props.quiz;

    return (
        <GlobalContainer fullScreen={IsFullscreen}>
            <QuizHeader>
                <QuizTitle>
                    {quiz.title}
                    <ControlButton onClick={() => setIsFullscreen(!IsFullscreen)}>
                        {IsFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </ControlButton>
                </QuizTitle>
                <QuizMeta>
                    <MetaItem>
                        <FaListAlt />
                        {quiz.intrebari.length} sections
                    </MetaItem>
                    <MetaItem>
                        <FaQuestionCircle />
                        {quiz.intrebari.reduce((acc, section) => acc + section.intrebari.length, 0)} questions
                    </MetaItem>
                    <MetaItem>
                        <FaFileAlt />
                        {quiz.intrebari.length} source files
                    </MetaItem>
                </QuizMeta>
            </QuizHeader>
            {IsShowRezolut ? (
                is_grila ? (
                    <QuizDIsplayRezultate quiz={quiz} correct={CorrectAnswrs} />
                ) : (
                    <QuizDisplayEvaluare 
                        correction={props.correction} 
                        Answers={Answrs} 
                        quiz={quiz}
                        setError={props.setError}
                    />
                )
            ) : (
                <>
                    <Container>
                        {quiz.intrebari.map((section, index) => (
                            <div key={index}>
                                <QuizDisplaySection 
                                    Answers={clone(Answrs)[index]} 
                                    setAnswers={(it:string[])=>handleSetAnswers(index,it)}
                                    CorrectAnswrs={CorrectAnswrs} 
                                    SelectedAnswers={SelectedAnswers} 
                                    index={index} 
                                    section={section} 
                                    setCorrectAnswers={setCorrectAnswers} 
                                    setSelectedAnswers={setSelectedAnswers} 
                                    key={index}
                                />
                            </div>
                        ))}
                    </Container>
                </>
            )}
            <Footer>
                <FooterButton onClick={() => {
                    if (IsShowRezolut) {
                        setIsShowRezout(false);
                        setSelectedAnswers(
                            quiz.intrebari.map(section => 
                                section.intrebari.map(() => false)
                            )
                        );
                        setCorrectAnswers(quiz.intrebari.map(() => []));
                    } else {
                        setIsShowRezout(true);
                    }
                }}>
                    {IsShowRezolut ? "Retake Quiz" : !is_grila?"Evaluate Answers":"Show Results"}
                </FooterButton>
            </Footer>
        </GlobalContainer>
    );
}