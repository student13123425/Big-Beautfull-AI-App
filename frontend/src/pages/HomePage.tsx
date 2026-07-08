import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  SupportedFormats,
  AboutAuthor,
} from '../components/home';
import { LanguageProvider } from '../components/home/LanguageContext';

interface HomePageProps {
  onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick }) => {
  useDocumentTitle('AI Study Assistant');

  return (
    <LanguageProvider>
      <HeroSection onLoginClick={onLoginClick} />
      <FeaturesSection />
      <SupportedFormats />
      <HowItWorksSection />
      <AboutAuthor />
    </LanguageProvider>
  );
};

export default HomePage;