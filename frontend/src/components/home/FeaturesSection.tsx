import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBrain, FaQuestionCircle, FaCheckCircle, FaFolderOpen, FaBolt, FaChartLine } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 5rem 2rem;
  background: #ffffff;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #eff6ff;
  color: #2563eb;
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
    background: linear-gradient(135deg, #3b82f6, #2563eb);
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

const Card = styled.div<{ $delay?: number }>`
  background: #f8fafc;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.7s ease-out;
  animation-delay: ${props => props.$delay || 0}s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.12);
    border-color: #93b4f5;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    font-size: 28px;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #64748b;
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
  { iconBg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', iconColor: '#2563eb' },
  { iconBg: 'linear-gradient(135deg, #fef3c7, #fde68a)', iconColor: '#d97706' },
  { iconBg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', iconColor: '#059669' },
  { iconBg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', iconColor: '#7c3aed' },
  { iconBg: 'linear-gradient(135deg, #ffedd5, #fed7aa)', iconColor: '#ea580c' },
  { iconBg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', iconColor: '#db2777' },
];

const FeaturesSection: React.FC = () => {
  const { texts } = useLanguage();

  return (
    <Container>
      <Inner>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <SectionBadge>{texts.coreFeaturesBadge}</SectionBadge>
        </div>
        <SectionTitle>
          {texts.sectionTitlePart1}{' '}
          <span className="highlight">{texts.sectionTitlePart2}</span>
        </SectionTitle>
        <SectionSubtitle>
          {texts.sectionSubtitle}
        </SectionSubtitle>

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