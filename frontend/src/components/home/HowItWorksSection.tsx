import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUpload, FaCogs, FaWrench, FaTrophy } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 5rem 2rem;
  background: #f8fafc;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  color: #16a34a;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 0.3px;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1rem;
  text-align: center;
  letter-spacing: -0.5px;
  
  .highlight {
    background: linear-gradient(135deg, #16a34a, #15803d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.15rem;
  color: #64748b;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 3rem;
  }
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
    gap: 2rem;
  }
`;

const StepCard = styled.div<{ $delay?: number }>`
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8ecf4;
  position: relative;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.7s ease-out;
  animation-delay: ${props => props.$delay || 0}s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(22, 163, 74, 0.12);
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const StepNumber = styled.div`
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  svg {
    font-size: 36px;
    color: #16a34a;
  }
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem;
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  color: #64748b;
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
    height: 3rem;
    background: linear-gradient(180deg, #bfdbfe, #dcfce7);
    transform: translateX(-50%);
  }
`;

const stepIcons = [<FaUpload />, <FaCogs />, <FaWrench />, <FaTrophy />];

const HowItWorksSection: React.FC = () => {
  const { texts } = useLanguage();

  return (
    <Container>
      <Inner>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <SectionBadge>{texts.simpleProcessBadge}</SectionBadge>
        </div>
        <SectionTitle>
          {texts.howItWorksTitlePart1}{' '}
          <span className="highlight">{texts.howItWorksTitlePart2}</span>
        </SectionTitle>
        <SectionSubtitle>
          {texts.howItWorksSubtitle}
        </SectionSubtitle>

        <StepsGrid>
          {texts.stepTitles.map((title, index) => (
            <React.Fragment key={index}>
              <StepCard $delay={index * 0.15}>
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