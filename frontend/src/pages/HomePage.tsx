import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  SupportedFormats,
  AboutAuthor,
} from '../components/home';

interface HomePageProps {
  onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick }) => {
  useDocumentTitle('AI Study Assistant');

  return (
    <>
      <HeroSection onLoginClick={onLoginClick} />
      <FeaturesSection />
      <SupportedFormats />
      <HowItWorksSection />
      <AboutAuthor />
    </>
  );
};

export default HomePage;
