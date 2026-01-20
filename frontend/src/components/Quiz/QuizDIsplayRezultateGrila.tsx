import React from 'react';
import type { Quiz } from '../../scripts/objects';
import { styled } from 'styled-components';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Add type for ContentText props
interface ContentTextProps {
  $correct?: boolean;
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 12px;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
  background-color: #f8fafc;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 8px;
`;

const SectionTitle = styled.h2`
  color: #1e293b;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
  font-family: 'Inter', sans-serif;
`;

const Sections = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
`;

const Bold = styled.span`
  font-weight: 700;
`;

const GroupRaspunsuri = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 6px;
  margin-bottom: 12px;
`;

// Add type to ContentText component
const ContentText = styled.div<ContentTextProps>`
  display: flex;
  align-items: flex-start;
  width: 100%;
  font-size: 14px;
  line-height: 1.4;
  padding: 8px;
  border-radius: 6px;
  background-color: ${props => props.$correct ? '#f0fdf4' : '#fef2f2'};
  border-left: 3px solid ${props => props.$correct ? '#16a34a' : '#dc2626'};
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  margin-right: 8px;
  margin-top: 2px;
`;

const TextWrapper = styled.div`
  flex: 1;
`;

const Gap = styled.span`
  display: inline-block;
  width: 4px;
`;

const SectionSubheader = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0;
  margin-bottom: 4px;
  border-bottom: 1px dashed #e2e8f0;
`;

const SectionTitleSmall = styled.h3`
  color: #334155;
  font-weight: 600;
  font-size: 14px;
  margin: 0;
  font-family: 'Inter', sans-serif;
`;

const ConclusionItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 6px 8px;
  border-radius: 6px;
  background-color: #f1f5f9;
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ScoreBadge = styled.span`
  display: inline-block;
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
  font-size: 13px;
`;

const SectionContent = styled.div`
  padding-left: 8px;
`;

const EmptyMessage = styled.div`
  font-size: 13px;
  color: #64748b;
  padding: 4px 8px;
  font-style: italic;
`;

export default function QuizDIsplayRezultate(props: {quiz: Quiz, correct: number[][] }) {
  let total_intrebari:number=0
  let total_correcte:number=0
  for(let c of props.correct)
    total_correcte+=c.length;
  for(let i of props.quiz.intrebari)
    total_intrebari+=i.intrebari.length
  let total_procentage:number=Math.floor((total_correcte/total_intrebari)*100)
  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Răspunsuri Greșite</SectionTitle>
      </SectionHeader>
      <Sections>
        {props.quiz.intrebari.map((section, i) => (
          <GroupRaspunsuri key={i}>
            <SectionSubheader>
              <SectionTitleSmall>{section.title}</SectionTitleSmall>
            </SectionSubheader>
            
            <SectionContent>
              {section.intrebari.filter(v => !props.correct[i].includes(v.id)).map((intrebare, j) => (
                <ContentText key={j} $correct={false}>
                  <IconWrapper>
                    <FaTimesCircle size={16} color='#dc2626' />
                  </IconWrapper>
                  <TextWrapper>
                    <Bold>{intrebare.text_intrebare}</Bold>
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>
                      Răspuns greșit (Corect: <Bold>{["a", "b", "c", "d"][intrebare.raspuns_correct_index]}</Bold>)
                    </div>
                  </TextWrapper>
                </ContentText>
              ))}
              
              {section.intrebari.filter(v => !props.correct[i].includes(v.id)).length === 0 && (
                <EmptyMessage>Niciun răspuns greșit</EmptyMessage>
              )}
            </SectionContent>
          </GroupRaspunsuri>
        ))}
      </Sections>
      
      <SectionHeader>
        <SectionTitle>Răspunsuri Corecte</SectionTitle>
      </SectionHeader>
      <Sections>
        {props.quiz.intrebari.map((section, i) => (
          <GroupRaspunsuri key={i}>
            <SectionSubheader>
              <SectionTitleSmall>{section.title}</SectionTitleSmall>
            </SectionSubheader>
            
            <SectionContent>
              {section.intrebari.filter(v => props.correct[i].includes(v.id)).map((intrebare, j) => (
                <ContentText key={j} $correct={true}>
                  <IconWrapper>
                    <FaCheckCircle size={16} color='#16a34a' />
                  </IconWrapper>
                  <TextWrapper>
                    <Bold>{intrebare.text_intrebare}</Bold>
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>
                      Răspuns corect
                    </div>
                  </TextWrapper>
                </ContentText>
              ))}
              
              {section.intrebari.filter(v => props.correct[i].includes(v.id)).length === 0 && (
                <EmptyMessage>Niciun răspuns corect</EmptyMessage>
              )}
            </SectionContent>
          </GroupRaspunsuri>
        ))}
      </Sections>
      
      <SectionHeader>
        <SectionTitle>Concluzie</SectionTitle>
      </SectionHeader>
      <Sections>
        {props.quiz.intrebari.map((section, i) => {
          const percentage = Math.floor((props.correct[i].length / section.intrebari.length) * 100);
          return (
            <ConclusionItem key={i}>
              <Bold>File:</Bold> {section.title}
              <ScoreBadge>
                {props.correct[i].length}/{section.intrebari.length} ({percentage}%)
              </ScoreBadge>
            </ConclusionItem>
          );
        })}
          <ConclusionItem key={99999999}>
              <Bold>Total</Bold>
              <ScoreBadge>
                {total_correcte}/{total_intrebari} ({total_procentage}%)
              </ScoreBadge>
            </ConclusionItem>
      </Sections>
    </Container>
  );
}