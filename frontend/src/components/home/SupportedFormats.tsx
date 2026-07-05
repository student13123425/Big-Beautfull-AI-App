import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 5rem 2rem;
  background: #ffffff;
  
  @media (max-width: 768px) {
    padding: 3.5rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.75rem;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.05rem;
  color: #64748b;
  margin: 0 auto 3rem;
  max-width: 550px;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 2.5rem;
  }
`;

const FormatsGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const FormatCard = styled.div<{ $delay?: number }>`
  background: white;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  width: 140px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 2px solid #e8ecf4;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;
  animation-delay: ${props => props.$delay || 0}s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
    border-color: #bfdbfe;
  }
`;

const FormatIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2rem;
`;

const FormatName = styled.span`
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
`;

const FormatDesc = styled.span`
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
`;

const Formats = [
  { icon: '📕', bg: '#fef2f2', name: 'PDF', desc: 'Portable Document' },
  { icon: '📘', bg: '#eff6ff', name: 'DOCX', desc: 'Word Documents' },
  { icon: '📙', bg: '#fff7ed', name: 'PPTX', desc: 'PowerPoint' },
  { icon: '📷', bg: '#f0fdf4', name: 'JPG/PNG', desc: 'Images' },
  { icon: '📝', bg: '#faf5ff', name: 'TXT', desc: 'Plain Text' },
];

const SupportedFormats: React.FC = () => {
  return (
    <Container>
      <Inner>
        <SectionTitle>Supported File Formats</SectionTitle>
        <SectionSubtitle>
          Upload any of these file types and let AI extract the key information for you.
        </SectionSubtitle>

        <FormatsGrid>
          {Formats.map((format, index) => (
            <FormatCard key={index} $delay={index * 0.1}>
              <FormatIcon style={{ background: format.bg }}>
                {format.icon}
              </FormatIcon>
              <FormatName>{format.name}</FormatName>
              <FormatDesc>{format.desc}</FormatDesc>
            </FormatCard>
          ))}
        </FormatsGrid>
      </Inner>
    </Container>
  );
};

export default SupportedFormats;