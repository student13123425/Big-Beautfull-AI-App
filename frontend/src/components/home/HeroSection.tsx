import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { HomeBackground } from './HomeBackground';
import { useLanguage } from './LanguageContext';
import { FaGraduationCap, FaArrowRight, FaChevronDown, FaGlobe } from 'react-icons/fa';
import ReactCountryFlag from 'react-country-flag';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const dropDownFade = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
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
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  transform: rotate(-5deg);
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(0deg) scale(1.05);
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

const DropdownContainer = styled.div`
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const DropdownTrigger = styled.button<{ $isOpen: boolean }>`
  background: rgba(255, 255, 255, 0.95);
  color: #2563eb;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.7rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    background: #ffffff;
  }

  .flag-icon {
    display: flex;
    align-items: center;
    line-height: 1;
    border-radius: 2px;
    overflow: hidden;
  }

  .icon-right {
    color: #94a3b8;
    display: flex;
    align-items: center;
    transition: transform 0.3s ease;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  }

  @media (max-width: 768px) {
    min-width: 140px;
    font-size: 0.85rem;
    padding: 0.6rem 1rem;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border-radius: 16px;
  padding: 0.5rem;
  margin: 0;
  list-style: none;
  min-width: 220px;
  max-height: 320px;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  animation: ${dropDownFade} 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  z-index: 20;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const DropdownItem = styled.li<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  color: ${({ $active }) => ($active ? '#2563eb' : '#475569')};
  background: ${({ $active }) => ($active ? '#eff6ff' : 'transparent')};
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  font-size: 0.95rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  .item-flag {
    display: flex;
    align-items: center;
    line-height: 1;
    border-radius: 2px;
    overflow: hidden;
  }

  &:hover {
    background: ${({ $active }) => ($active ? '#eff6ff' : '#f8fafc')};
    color: #2563eb;
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

const supportedLanguages: string[] = [
  "English",
  "Mandarin Chinese",
  "Romanian",
  "Spanish",
  "Modern Standard Arabic",
  "French",
  "Russian",
  "German",
  "Japanese",
  "Vietnamese",
  "Turkish",
];

const languageCodes: Record<string, string> = {
  "English": "GB",
  "Mandarin Chinese": "CN",
  "Romanian": "RO",
  "Spanish": "ES",
  "Modern Standard Arabic": "SA",
  "French": "FR",
  "Russian": "RU",
  "German": "DE",
  "Japanese": "JP",
  "Vietnamese": "VN",
  "Turkish": "TR"
};

const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick }) => {
  const { language, setLanguage, texts } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang as typeof language);
    setIsDropdownOpen(false);
  };

  return (
    <Container>
      <HomeBackground />
      
      <LanguageDropdownWrapper>
        <DropdownContainer ref={dropdownRef}>
          <DropdownTrigger 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            $isOpen={isDropdownOpen}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="flag-icon">
                {languageCodes[language as string] ? (
                  <ReactCountryFlag 
                    countryCode={languageCodes[language as string]} 
                    svg 
                    style={{ width: '1.2em', height: '1.2em' }} 
                  />
                ) : (
                  <FaGlobe size={16} />
                )}
              </span>
              <span>{language}</span>
            </div>
            <span className="icon-right"><FaChevronDown size={14} /></span>
          </DropdownTrigger>
          
          {isDropdownOpen && (
            <DropdownMenu>
              {supportedLanguages.map((lang) => (
                <DropdownItem 
                  key={lang} 
                  $active={language === lang}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <span className="item-flag">
                    <ReactCountryFlag 
                      countryCode={languageCodes[lang]} 
                      svg 
                      style={{ width: '1.2em', height: '1.2em' }} 
                    />
                  </span>
                  {lang}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </DropdownContainer>
      </LanguageDropdownWrapper>

      <Content>
        <LogoWrapper>
          <LogoIcon>
            <FaGraduationCap color="#ffffff" size={128} />
          </LogoIcon>
        </LogoWrapper>

        <Title>{texts.appTitle}</Title>
        <Tagline>{texts.tagline}</Tagline>

        <CTAButton onClick={onLoginClick}>
          {texts.ctaButton}
          <span className="arrow-icon">
            <FaArrowRight size={22} /> 
          </span>
        </CTAButton>
      </Content>
    </Container>
  );
};

export default HeroSection;