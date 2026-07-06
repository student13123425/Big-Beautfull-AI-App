import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const BIRTHDATE = new Date(2001, 1, 3); // February 3rd, 2001 (month is 0-indexed)

const calculateAge = (birthdate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
};

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 5rem 2rem;
  background: #f8fafc;
  
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
  background: #eff6ff;
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
  background: #f8fafc;
  border-radius: 12px;
  
  span {
    font-size: 0.95rem;
    color: #475569;
    font-weight: 500;
  }
`;

const SkillIcon = styled.span`
  font-size: 1.2rem;
`;

const AboutAuthor: React.FC = () => {
  const [age, setAge] = useState<number>(calculateAge(BIRTHDATE));

  useEffect(() => {
    // Recalculate age on mount and periodically thereafter
    const updateAge = () => {
      setAge(calculateAge(BIRTHDATE));
    };
    updateAge();
    // Check once per day in case the page stays open across midnight
    const interval = setInterval(updateAge, 60 * 60 * 1000); // every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Inner>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <SectionLabel>👤 About the Author</SectionLabel>
        </div>
        
        <Card>
          <Header>
            <Avatar>MN</Avatar>
            <div>
              <AuthorName>Mihai Nicolae</AuthorName>
              <AuthorRole>
                Student at Universitatea Romano-Americana • Aspiring Software Developer
              </AuthorRole>
            </div>
          </Header>

          <BioText>
            Numele meu este Mihai Nicolae, am {age} de ani și sunt student în anul I la Facultatea de Informatică Managerială din cadrul Universității Romano-Americane. Sunt pasionat de tehnologie și programare, domeniu pe care îl studiez autodidact de peste 3 ani.
          </BioText>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', color: '#2563eb', padding: '8px 18px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', marginTop: '1rem' }}>
            <span>🎂</span>
            <span>Born on February 3rd, 2001 • Age: {age}</span>
          </div>

          <BioText>
            Acest proiect este un portfolio personal — am creat AI Study Assistant pentru a arăta angajatorilor că îmi place să construiesc lucruri utile și să învăț constant tehnologii noi. Obiectivul meu este să obțin o calificare profesională în IT și să dobândesc experiență practică printr-un job în domeniu.
          </BioText>

          <SkillsGrid>
            <SkillItem>
              <SkillIcon>⚛️</SkillIcon>
              <span>React / TypeScript</span>
            </SkillItem>
            <SkillItem>
              <SkillIcon>🟢</SkillIcon>
              <span>Node.js / Express</span>
            </SkillItem>
            <SkillItem>
              <SkillIcon>🤖</SkillIcon>
              <span>AI / LLM Integration</span>
            </SkillItem>
            <SkillItem>
              <SkillIcon>🐙</SkillIcon>
              <span>Git / GitHub</span>
            </SkillItem>
          </SkillsGrid>
        </Card>
      </Inner>
    </Container>
  );
};

export default AboutAuthor;