import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { LanguageProvider } from '../components/home/LanguageContext';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import SupportedFormats from '../components/home/SupportedFormats';
import HowItWorksSection from '../components/home/HowItWorksSection';
import AboutAuthor from '../components/home/AboutAuthor';

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