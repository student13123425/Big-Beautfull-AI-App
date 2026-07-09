import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaReact, FaRobot, FaGithub, FaNodeJs } from 'react-icons/fa';
import { fetchAuthorBirthday } from '../../network/profile';
import { useLanguage } from './LanguageContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const Container = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 4rem 1.25rem;
  }
`;

const Inner = styled.div`
  max-width: 860px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 3.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  animation: ${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    box-shadow: 0 25px 35px -5px rgba(0, 0, 0, 0.2);
    transform: translateY(-4px);
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
`;

const Avatar = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  color: #ffffff;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2), 0 0 0 6px rgba(37, 99, 235, 0.1);
  letter-spacing: -1px;
`;

const AuthorName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const AuthorRole = styled.p`
  font-size: 1.05rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
`;

const BioText = styled.p`
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.75;
  margin: 0 0 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-top: 2.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid #f1f5f9;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding-top: 2rem;
    margin-top: 2rem;
  }
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border: 1px solid #1e40af;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
  
  &:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    border-color: #1e3a8a;
    box-shadow: 0 6px 12px rgba(37, 99, 235, 0.2);
    transform: translateY(-2px);
  }
  
  span {
    font-size: 0.95rem;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.3px;
  }
`;

const SkillIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const skillIcons = [
  <FaReact />,
  <FaNodeJs />,
  <FaRobot />,
  <FaGithub />
];

const skillStyles = [
  { bg: 'rgba(255, 255, 255, 0.15)', color: '#ffffff' },
  { bg: 'rgba(255, 255, 255, 0.15)', color: '#ffffff' },
  { bg: 'rgba(255, 255, 255, 0.15)', color: '#ffffff' },
  { bg: 'rgba(255, 255, 255, 0.15)', color: '#ffffff' }
];

const LoadingSkeleton = styled.div`
  height: 20px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 100%;
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  
  &:last-child {
    width: 80%;
  }
`;

const calculateAge = (birthdate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
};

const AboutAuthor = () => {
  const [age, setAge] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { texts } = useLanguage();

  useEffect(() => {
    const initBirthday = async () => {
      const birthdayStr = await fetchAuthorBirthday();
      
      if (birthdayStr) {
        const birthdate = new Date(birthdayStr);
        setAge(calculateAge(birthdate));
      } else {
        const fallbackDate = new Date(2001, 1, 3);
        setAge(calculateAge(fallbackDate));
      }
      
      setLoading(false);
    };

    initBirthday();

    const interval = setInterval(() => {
      const birthdayStr = process.env.AUTHOR_BIRTHDAY || '2001-02-03';
      const birthdate = new Date(birthdayStr);
      setAge(calculateAge(birthdate));
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Container>
        <Inner>
          <SectionHeader>
            <SectionLabel>{texts.aboutAuthorBadge}</SectionLabel>
          </SectionHeader>
          <Card>
            <LoadingSkeleton style={{ height: '60px', width: '60px', borderRadius: '50%', marginBottom: '2rem' }} />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </Card>
        </Inner>
      </Container>
    );
  }

  return (
    <Container>
      <Inner>
        <SectionHeader>
          <SectionLabel>{texts.aboutAuthorBadge}</SectionLabel>
        </SectionHeader>
        
        <Card>
          <Header>
            <Avatar>MN</Avatar>
            <div>
              <AuthorName>{texts.authorName}</AuthorName>
              <AuthorRole>{texts.authorRole}</AuthorRole>
            </div>
          </Header>

          <BioText>
            {texts.bioTexts[0].replace('{age}', String(age))}
          </BioText>

          <BioText>
            {texts.bioTexts[1]}
          </BioText>

          <SkillsGrid>
            {texts.skillLabels.map((label, index) => (
              <SkillItem key={index}>
                <SkillIconWrapper style={{ background: skillStyles[index].bg, color: skillStyles[index].color }}>
                  {skillIcons[index]}
                </SkillIconWrapper>
                <span>{label}</span>
              </SkillItem>
            ))}
          </SkillsGrid>
        </Card>
      </Inner>
    </Container>
  );
};

export default AboutAuthor;