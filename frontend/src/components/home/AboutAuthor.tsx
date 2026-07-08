import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaReact, FaRobot, FaGithub, FaNodeJs } from 'react-icons/fa';
import { fetchAuthorBirthday } from '../../network/profile';
import { useLanguage } from './LanguageContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8ecf4;
  animation: ${fadeInUp} 0.7s ease-out;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);
`;

const AuthorName = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const AuthorRole = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`;

const SectionLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #2563eb;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 0.3px;
`;

const BioText = styled.p`
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.8;
  margin: 0 0 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  border-radius: 12px;
  
  span {
    font-size: 0.95rem;
    color: #ffffff;
    font-weight: 500;
  }
`;

const SkillIcon = styled.span`
  font-size: 1.4rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const skillIcons = [<FaReact />, <FaNodeJs />, <FaRobot />, <FaGithub />];

const calculateAge = (birthdate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
};

const AboutAuthor: React.FC = () => {
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
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <SectionLabel>{texts.aboutAuthorBadge}</SectionLabel>
          </div>
          <Card>
            <p>Loading...</p>
          </Card>
        </Inner>
      </Container>
    );
  }

  return (
    <Container>
      <Inner>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <SectionLabel>{texts.aboutAuthorBadge}</SectionLabel>
        </div>
        
        <Card>
          <Header>
            <Avatar>MN</Avatar>
            <div>
              <AuthorName>{texts.authorName}</AuthorName>
              <AuthorRole>
                {texts.authorRole}
              </AuthorRole>
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
                <SkillIcon>{skillIcons[index]}</SkillIcon>
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