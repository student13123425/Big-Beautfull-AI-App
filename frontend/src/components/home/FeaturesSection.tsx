import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBrain, FaQuestionCircle, FaCheckCircle, FaFolderOpen, FaBolt, FaChartLine } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 6rem 2rem;
  background: #f8fafc;
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
  background: rgba(37, 99, 235, 0.05);
  color: #2563eb;
  padding: 6px 16px;
  border: 1px solid rgba(37, 99, 235, 0.15);
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
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: ${props => props.$delay || 0}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.12);
    border-color: #cbd5e1;
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.75rem;
  
  svg {
    font-size: 22px;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem;
  letter-spacing: -0.01em;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
`;

const featureIcons = [
  <FaBrain />,
  <FaQuestionCircle />,
  <FaCheckCircle />,
  <FaFolderOpen />,
  <FaBolt />,
  <FaChartLine />,
];

const featureStyles = [
  { iconBg: 'rgba(37, 99, 235, 0.08)', iconColor: '#2563eb' },
  { iconBg: 'rgba(217, 119, 6, 0.08)', iconColor: '#d97706' },
  { iconBg: 'rgba(5, 150, 105, 0.08)', iconColor: '#059669' },
  { iconBg: 'rgba(124, 58, 237, 0.08)', iconColor: '#7c3aed' },
  { iconBg: 'rgba(234, 88, 12, 0.08)', iconColor: '#ea580c' },
  { iconBg: 'rgba(219, 39, 119, 0.08)', iconColor: '#db2777' },
];

const FeaturesSection = () => {
  const { texts } = useLanguage();

  return (
    <Container>
      <Inner>
        <SectionHeader>
          <SectionBadge>{texts.coreFeaturesBadge}</SectionBadge>
          <SectionTitle>
            {texts.sectionTitlePart1}{' '}
            <span className="highlight">{texts.sectionTitlePart2}</span>
          </SectionTitle>
          <SectionSubtitle>
            {texts.sectionSubtitle}
          </SectionSubtitle>
        </SectionHeader>

        <Grid>
          {texts.featureTitles.map((title, index) => (
            <Card key={index} $delay={index * 0.1}>
              <IconWrapper style={{ background: featureStyles[index].iconBg }}>
                <span style={{ color: featureStyles[index].iconColor }}>
                  {featureIcons[index]}
                </span>
              </IconWrapper>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{texts.featureDescriptions[index]}</CardDescription>
            </Card>
          ))}
        </Grid>
      </Inner>
    </Container>
  );
};

export default FeaturesSection;