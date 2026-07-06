import React from 'react';
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
  return (
    <>
      <HeroSection onLoginClick={onLoginClick} />
      <FeaturesSection />
      <HowItWorksSection />
      <SupportedFormats />
      <AboutAuthor />
    </>
  );
};

export default HomePage;
