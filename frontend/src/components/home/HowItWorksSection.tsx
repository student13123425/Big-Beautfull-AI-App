import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUpload, FaCogs, FaWrench, FaTrophy } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 6rem 2rem;
  background: #ffffff;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 4rem 1.25rem;
  }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 680px;
  margin: 0 auto 4rem;
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(22, 163, 74, 0.05);
  color: #16a34a;
  padding: 6px 16px;
  border: 1px solid rgba(22, 163, 74, 0.15);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.25rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
  
  .highlight {
    background: linear-gradient(135deg, #16a34a, #15803d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: #475569;
  line-height: 1.7;
  margin: 0;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const StepCard = styled.div<{ $delay?: number }>`
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
  position: relative;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: ${props => props.$delay || 0}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(22, 163, 74, 0.12);
    border-color: #bbf7d0;
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
`;

const StepNumber = styled.div`
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.25);
  border: 2px solid #ffffff;
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(22, 163, 74, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  svg {
    font-size: 24px;
    color: #16a34a;
  }
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.75rem;
  letter-spacing: -0.01em;
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
`;

const Connector = styled.div`
  display: none;
  
  @media (max-width: 1024px) {
    display: block;
    position: absolute;
    left: 50%;
    top: 100%;
    width: 2px;
    height: 2.5rem;
    background: linear-gradient(180deg, rgba(22, 163, 74, 0.2), transparent);
    transform: translateX(-50%);
  }
`;

const stepIcons = [<FaUpload />, <FaCogs />, <FaWrench />, <FaTrophy />];

const HowItWorksSection = () => {
  const { texts } = useLanguage();

  return (
    <Container>
      <Inner>
        <SectionHeader>
          <SectionBadge>{texts.simpleProcessBadge}</SectionBadge>
          <SectionTitle>
            {texts.howItWorksTitlePart1}{' '}
            <span className="highlight">{texts.howItWorksTitlePart2}</span>
          </SectionTitle>
          <SectionSubtitle>
            {texts.howItWorksSubtitle}
          </SectionSubtitle>
        </SectionHeader>

        <StepsGrid>
          {texts.stepTitles.map((title, index) => (
            <React.Fragment key={index}>
              <StepCard $delay={index * 0.1}>
                <StepNumber>{index + 1}</StepNumber>
                <IconWrapper>
                  {stepIcons[index]}
                </IconWrapper>
                <StepTitle>{title}</StepTitle>
                <StepDescription>{texts.stepDescriptions[index]}</StepDescription>
              </StepCard>
              {index < texts.stepTitles.length - 1 && <Connector />}
            </React.Fragment>
          ))}
        </StepsGrid>
      </Inner>
    </Container>
  );
};

export default HowItWorksSection;