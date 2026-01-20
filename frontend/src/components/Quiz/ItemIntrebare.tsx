import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import type { Intrebare } from '../../scripts/objects';
import { clone } from '../../scripts/aox';

const Container = styled.div<{ $isUnanswered: boolean }>`
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
  border: 2px solid ${props => props.$isUnanswered ? '#ef4444' : '#f1f5f9'};
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 4px;
    width: 100%;
    background: ${props => props.$isUnanswered 
      ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' 
      : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'};
    opacity: ${props => props.$isUnanswered ? 1 : 0};
    transition: opacity 0.3s ease;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
`;

const QuestionIndicator = styled.div<{ $isUnanswered: boolean }>`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$isUnanswered 
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const QuestionText = styled.h2<{ $isUnanswered: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$isUnanswered ? '#ef4444' : '#1e293b'};
  margin: 0;
  line-height: 1.6;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding-top: 4px;
`;

const ContainerAnswers = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AnswerItem = styled.button<{ $selected: boolean }>`
  user-select: none;
  cursor: pointer;
  outline: none;
  border: none;
  font-size: 16px;
  padding: 18px 20px 18px 56px;
  border-radius: 12px;
  background-color: ${props => props.$selected ? '#f0f7ff' : '#f8fafc'};
  color: ${props => props.$selected ? '#1d4ed8' : '#334155'};
  text-align: left;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border: 1px solid ${props => props.$selected ? '#3b82f6' : '#e2e8f0'};
  transition: all 0.25s ease;
  position: relative;
  text-align: left;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: ${props => props.$selected ? '#2563eb' : '#cbd5e1'};
    background-color: ${props => props.$selected ? '#e0f0ff' : '#f1f5f9'};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid ${props => props.$selected ? '#3b82f6' : '#cbd5e1'};
    background: ${props => props.$selected ? '#3b82f6' : 'white'};
    transition: all 0.2s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 27px;
    transform: translateY(-50%) rotate(45deg);
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 2px 2px 0;
    opacity: ${props => props.$selected ? '1' : '0'};
    transition: opacity 0.2s ease;
  }
`;

const AnswerLetter = styled.span`
  font-weight: 700;
  margin-right: 8px;
  color: inherit;
`;

const ErrorMessage = styled.div`
  color: #b91c1c;
  font-size: 15px;
  font-weight: 500;
  margin-top: 16px;
  padding: 14px 18px;
  background-color: #fff5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #fee2e2;
  animation: pulse 1.5s infinite;
  
  &::before {
    content: '!';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border-radius: 50%;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2); }
    70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
`;

const TextAreaInput = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 9px 10px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  font-size: 19px;
  font-family: 'Inter', sans-serif;
  color: #334155;
  resize: vertical;
  transition: all 0.25s ease;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:hover {
    border-color: #cbd5e1;
    background-color: #f1f5f9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  &:focus {
    border-color: #3b82f6;
    background-color: #f0f7ff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

export default function ItemIntrebare(props: { 
  item: Intrebare, 
  Corect: number[], 
  setCorect: Function, 
  isFailedSubmit: boolean
  setSelected:Function,
  setAnswer:Function
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [Answer,setAnswer]=useState<string>("")
  const is_grila:boolean=props.item.raspunsuri.length!==0
  useEffect(() => {
    if(is_grila){
      const is_correct: boolean = selectedAnswer === props.item.raspuns_correct_index;
      const c: number[] = clone(props.Corect);
      
      if (!c.includes(props.item.id) && is_correct) {
        c.push(props.item.id);
      } else if (c.includes(props.item.id) && !is_correct) {
        c.splice(c.indexOf(props.item.id), 1);
      }
      props.setSelected(selectedAnswer!==-1)
      props.setCorect(c);
    }else{
      props.setAnswer(Answer)
    }
  }, [selectedAnswer,Answer]);
  useEffect(()=>{
      setSelectedAnswer(-1);
      setAnswer("");
  },[props.item])
  const isUnanswered = props.isFailedSubmit && selectedAnswer === -1;

  return (
    <Container $isUnanswered={isUnanswered}>
      <QuestionHeader>
        <QuestionIndicator $isUnanswered={isUnanswered}>
          ?
        </QuestionIndicator>
        <QuestionText $isUnanswered={isUnanswered}>
          {props.item.text_intrebare}
        </QuestionText>
      </QuestionHeader>
      
      <ContainerAnswers>
        {props.item.raspunsuri.map((answer, i) => (
          <AnswerItem 
            key={i}
            $selected={selectedAnswer === i}
            onClick={() => setSelectedAnswer(prev => prev === i ? -1 : i)}
          >
            <AnswerLetter>{String.fromCharCode(65 + i)}.</AnswerLetter> 
            {answer}
          </AnswerItem>
        ))}
        {props.item.raspunsuri.length===0?<TextAreaInput placeholder='raspunde la intrebare' onChange={(e)=>{
          setAnswer(e.target.value);
        }} value={Answer}/>:<></>}
      </ContainerAnswers>
      {isUnanswered && (
        <ErrorMessage>
          Trebuie să selectați un răspuns pentru această întrebare
        </ErrorMessage>
      )}
    </Container>
  );
}