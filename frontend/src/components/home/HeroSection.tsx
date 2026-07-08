import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { HomeBackground } from './HomeBackground';
import { getSupportedLanguages } from '../../scripts/aox';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 8px 30px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 8px 50px rgba(59, 130, 246, 0.5); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const Particle = styled.div<{ $size: number; $delay: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: rgba(255, 255, 255, ${(props) => 0.03 + (props.$size / 400) * 0.05});
  border-radius: 50%;
  animation: ${float} ${(props) => 8 + props.$delay}s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay}s;
  
  &:nth-child(1) { top: -5%; left: -5%; }
  &:nth-child(2) { top: 60%; right: -3%; }
  &:nth-child(3) { bottom: 10%; left: 15%; }
  &:nth-child(4) { top: 20%; right: 20%; }
  &:nth-child(5) { bottom: 30%; right: 10%; }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 950px;
  width: 100%;
  text-align: center;
`;

const LogoWrapper = styled.div`
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.8s ease-out;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const LogoIcon = styled.div`
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,245,255,0.9));
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: rotate(-5deg);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: rotate(0deg) scale(1.05);
  }
  
  svg {
    font-size: 42px;
  }
`;

const Title = styled.h1`
  font-size: 3.8rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1rem;
  line-height: 1.15;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  letter-spacing: -1px;
  
  .highlight {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 768px) {
    font-size: 2.4rem;
    letter-spacing: -0.5px;
  }
`;

const Tagline = styled.p`
  font-size: 1.35rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 auto 2.5rem;
  max-width: 650px;
  line-height: 1.6;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin-bottom: 2rem;
  }
`;

const LanguageDropdownWrapper = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 10;
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
  }
`;

const LanguageSelect = styled.select`
  background: rgba(255, 255, 255, 0.95);
  color: #2563eb;
  border: none;
  border-radius: 12px;
  padding: 0.7rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-width: 160px;
  outline: none;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
  }

  option {
    background: #ffffff;
    color: #333;
    padding: 8px;
  }

  @media (max-width: 768px) {
    min-width: 120px;
    font-size: 0.85rem;
    padding: 0.5rem 0.8rem;
  }
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #ffffff, #f0f4ff);
  color: #2563eb;
  border: none;
  border-radius: 16px;
  padding: 1.1rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  animation: ${fadeInUp} 0.8s ease-out, ${pulseGlow} 3s ease-in-out infinite;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 50px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  .arrow-icon {
    display: inline-flex;
    transition: transform 0.3s ease;
  }
  
  &:hover .arrow-icon {
    transform: translateX(4px);
  }
  
  @media (max-width: 768px) {
    padding: 0.9rem 2rem;
    font-size: 1.05rem;
    border-radius: 12px;
  }
`;

interface HeroSectionProps {
  onLoginClick: () => void;
}

const supportedLanguages: string[] = getSupportedLanguages();

const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  return (
    <Container>
      <HomeBackground/>
      <LanguageDropdownWrapper>
        <LanguageSelect
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </LanguageSelect>
      </LanguageDropdownWrapper>
      <Content>
        <LogoWrapper>
          <LogoIcon>
            🎓
          </LogoIcon>
        </LogoWrapper>

        <Title>
          AI Study Assistant
        </Title>

        <Tagline>
          Upload your lecture notes, textbooks, and study materials to generate 
          AI-powered summaries, quizzes, and interactive Q&A.
        </Tagline>

        <CTAButton onClick={onLoginClick}>
          Start Studying
          <span className="arrow-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </CTAButton>
      </Content>
    </Container>
  );
};

export default HeroSection;