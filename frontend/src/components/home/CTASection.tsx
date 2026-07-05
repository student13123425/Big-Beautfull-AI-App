import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const Container = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #2563eb 100%);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const BackgroundCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  animation: ${float} 8s ease-in-out infinite;
  
  &:nth-child(1) {
    width: 400px;
    height: 400px;
    top: -150px;
    right: -100px;
  }
  
  &:nth-child(2) {
    width: 300px;
    height: 300px;
    bottom: -100px;
    left: -80px;
    animation-delay: 3s;
  }
`;

const Inner = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
`;

const CTAIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 2rem;
  animation: ${float} 4s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 auto 3rem;
  max-width: 600px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled.button`
  background: white;
  color: #2563eb;
  border: none;
  border-radius: 14px;
  padding: 1.1rem 2.5rem;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
`;

const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  padding: 1.1rem 2.5rem;
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.5s;
  animation-fill-mode: both;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
`;

interface CTASectionProps {
  onLoginClick: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onLoginClick }) => {
  return (
    <Container>
      <BackgroundCircle />
      <BackgroundCircle />
      
      <Inner>
        <CTAIcon>🚀</CTAIcon>
        <CTATitle>Ready to Transform Your Study Game?</CTATitle>
        <CTADescription>
          Join thousands of students who are already using AI to study smarter, not harder. 
          Start creating powerful summaries and quizzes in seconds.
        </CTADescription>
        
        <ButtonGroup>
          <PrimaryButton onClick={onLoginClick}>
            Get Started Free
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </PrimaryButton>
          
          <SecondaryButton onClick={onLoginClick}>
            Learn More
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V4M12 8L8 12M12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SecondaryButton>
        </ButtonGroup>
      </Inner>
    </Container>
  );
};

export default CTASection;