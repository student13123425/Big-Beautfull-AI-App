import React from 'react';
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  StatsSection,
  SupportedFormats,
  TestimonialsSection,
  FAQSection,
  CTASection,
  HomeFooter,
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
      <StatsSection />
      <SupportedFormats />
      <TestimonialsSection />
      <FAQSection />
      <CTASection onLoginClick={onLoginClick} />
      <HomeFooter />
    </>
  );
};

export default HomePage;