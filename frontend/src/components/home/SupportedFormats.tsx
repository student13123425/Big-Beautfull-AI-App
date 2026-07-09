import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaImage, FaFileAlt } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 4rem 1.25rem;
  }
`;

const Inner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
`;

const SectionHeader = styled.div`
  max-width: 680px;
  margin: 0 auto 3.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: #bfdbfe;
  line-height: 1.7;
  margin: 0;
`;

const FormatsGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1.25rem;
  }
`;

const FormatCard = styled.div<{ $delay?: number }>`
  background: #ffffff;
  border-radius: 16px;
  padding: 2.25rem 1.5rem;
  width: 160px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: ${props => props.$delay || 0}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: calc(50% - 0.625rem);
    padding: 2rem 1rem;
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  
  svg {
    font-size: 24px;
  }
`;

const FormatName = styled.span`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.375rem;
  letter-spacing: -0.01em;
`;

const FormatDesc = styled.span`
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
`;

const formatIcons = [
  <FaFilePdf />,
  <FaFileWord />,
  <FaFilePowerpoint />,
  <FaImage />,
  <FaFileAlt />
];

const formatStyles = [
  { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  { bg: 'rgba(249, 115, 22, 0.1)', color: '#f97316' },
  { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }
];

const SupportedFormats = () => {
  const { texts } = useLanguage();

  return (
    <Container>
      <Inner>
        <SectionHeader>
          <SectionTitle>{texts.formatsSectionTitle}</SectionTitle>
          <SectionSubtitle>
            {texts.formatsSectionSubtitle}
          </SectionSubtitle>
        </SectionHeader>

        <FormatsGrid>
          {texts.formatNames.map((name, index) => (
            <FormatCard key={index} $delay={index * 0.1}>
              <IconWrapper style={{ background: formatStyles[index].bg, color: formatStyles[index].color }}>
                {formatIcons[index]}
              </IconWrapper>
              <FormatName>{name}</FormatName>
              <FormatDesc>{texts.formatDescriptions[index]}</FormatDesc>
            </FormatCard>
          ))}
        </FormatsGrid>
      </Inner>
    </Container>
  );
};

export default SupportedFormats;