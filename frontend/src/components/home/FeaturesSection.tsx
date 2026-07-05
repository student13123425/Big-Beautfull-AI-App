import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBrain, FaQuestionCircle, FaCheckCircle, FaFolderOpen, FaBolt, FaChartLine } from 'react-icons/fa';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
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
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8ecf4;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.7s ease-out;
  animation-delay: ${props => props.$delay || 0}s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.12);
    border-color: #bfdbfe;
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

const FeatureData = [
  {
    icon: <FaBrain />,
    iconBg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    iconColor: '#2563eb',
    title: 'AI-Powered Summaries (Sinteză)',
    description: 'Generate comprehensive, structured summaries from any PDF, DOCX, or presentation file using advanced AI models that understand academic content.',
  },
  {
    icon: <FaQuestionCircle />,
    iconBg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    iconColor: '#d97706',
    title: 'Smart Document Q&A',
    description: 'Ask specific questions about your uploaded documents and get instant, context-aware answers powered by AI — like having a tutor available 24/7.',
  },
  {
    icon: <FaCheckCircle />,
    iconBg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    iconColor: '#059669',
    title: 'Auto Quiz Generation',
    description: 'Create customized multiple-choice quizzes from your study materials. Configure question count and difficulty for effective self-assessment.',
  },
  {
    icon: <FaFolderOpen />,
    iconBg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    iconColor: '#7c3aed',
    title: 'Subject Organization',
    description: 'Organize all your study materials by subject (materie). Keep everything structured and easily accessible throughout the semester.',
  },
  {
    icon: <FaBolt />,
    iconBg: 'linear-gradient(135deg, #ffedd5, #fed7aa)',
    iconColor: '#ea580c',
    title: 'Multi-Format Support',
    description: 'Upload PDFs, Word documents, PowerPoint presentations, and images. The AI processes and extracts key information from any format.',
  },
  {
    icon: <FaChartLine />,
    iconBg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    iconColor: '#db2777',
    title: 'Progress Tracking',
    description: 'Track your learning progress with built-in analytics. See which topics you\'ve mastered and where you need more practice.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <Container>
      <Inner>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <SectionBadge>✨ Core Features</SectionBadge>
        </div>
        <SectionTitle>
          Everything You Need to{' '}
          <span className="highlight">Ace Your Exams</span>
        </SectionTitle>
        <SectionSubtitle>
          Powerful AI tools designed specifically for students who want to study smarter, not harder.
        </SectionSubtitle>

        <Grid>
          {FeatureData.map((feature, index) => (
            <Card key={index} $delay={index * 0.1}>
              <IconWrapper style={{ background: feature.iconBg }}>
                <span style={{ color: feature.iconColor }}>{feature.icon}</span>
              </IconWrapper>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </Grid>
      </Inner>
    </Container>
  );
};

export default FeaturesSection;