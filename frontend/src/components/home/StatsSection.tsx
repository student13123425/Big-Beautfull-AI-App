import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #2563eb 100%);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 3.5rem 1.5rem;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%);
  pointer-events: none;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const StatCard = styled.div<{ $delay?: number }>`
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.7s ease-out;
  animation-delay: ${props => props.$delay || 0}s;
  animation-fill-mode: both;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-4px);
  }
`;

const StatNumber = styled.div`
  font-size: 3.2rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.5rem;
  line-height: 1;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
`;

const StatSuffix = styled.span`
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const StatIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const StatsData = [
  {
    icon: '📄',
    number: '50K+',
    label: 'Documents Processed',
  },
  {
    icon: '❓',
    number: '200K+',
    label: 'Quiz Questions Generated',
  },
  {
    icon: '📚',
    number: '15K+',
    label: 'Active Subjects',
  },
  {
    icon: '👨‍🎓',
    number: '8K+',
    label: 'Students Helping',
  },
];

const StatsSection: React.FC = () => {
  return (
    <Container>
      <BackgroundPattern />
      <Inner>
        <StatsGrid>
          {StatsData.map((stat, index) => (
            <StatCard key={index} $delay={index * 0.1}>
              <StatIcon>{stat.icon}</StatIcon>
              <StatNumber>
                {stat.number.replace(/[^0-9]/g, '')}<StatSuffix>{stat.number.replace(/[0-9]/g, '')}</StatSuffix>
              </StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </Inner>
    </Container>
  );
};

export default StatsSection;