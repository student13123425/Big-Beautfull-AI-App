import React from 'react';
import styled from 'styled-components';

const Container = styled.footer`
  padding: 4rem 2rem 2rem;
  background: #0f172a;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid #1e293b;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BrandSection = styled.div`
  max-width: 300px;
`;

const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BrandDescription = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
  
  a {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #1e293b;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: #3b82f6;
      color: white;
      transform: translateY(-2px);
    }
  }
`;

const Column = styled.div`
  min-width: 150px;
`;

const ColumnTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1.25rem;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 0.75rem;
  }
`;

const LinkItem = styled.a`
  font-size: 0.95rem;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  
  a {
    font-size: 0.9rem;
    color: #64748b;
    text-decoration: none;
    
    &:hover {
      color: #3b82f6;
    }
  }
`;

const HomeFooter: React.FC = () => {
  return (
    <Container>
      <Inner>
        <TopSection>
          <BrandSection>
            <LogoText>🎓 AI Study Assistant</LogoText>
            <BrandDescription>
              Transform your study materials with AI-powered learning tools. 
              Summaries, quizzes, and Q&A — all from your own documents.
            </BrandDescription>
            <SocialLinks>
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="GitHub">⌨</a>
              <a href="#" aria-label="Discord">💬</a>
            </SocialLinks>
          </BrandSection>

          <Column>
            <ColumnTitle>Product</ColumnTitle>
            <LinkList>
              <li><LinkItem href="#">Features</LinkItem></li>
              <li><LinkItem href="#">Pricing</LinkItem></li>
              <li><LinkItem href="#">Upload Docs</LinkItem></li>
              <li><LinkItem href="#">Quiz Generator</LinkItem></li>
            </LinkList>
          </Column>

          <Column>
            <ColumnTitle>Resources</ColumnTitle>
            <LinkList>
              <li><LinkItem href="#">Documentation</LinkItem></li>
              <li><LinkItem href="#">Tutorials</LinkItem></li>
              <li><LinkItem href="#">Blog</LinkItem></li>
              <li><LinkItem href="#">API</LinkItem></li>
            </LinkList>
          </Column>

          <Column>
            <ColumnTitle>Company</ColumnTitle>
            <LinkList>
              <li><LinkItem href="#">About Us</LinkItem></li>
              <li><LinkItem href="#">Contact</LinkItem></li>
              <li><LinkItem href="#">Careers</LinkItem></li>
              <li><LinkItem href="#">Press Kit</LinkItem></li>
            </LinkList>
          </Column>
        </TopSection>

        <BottomSection>
          <Copyright>© 2025 AI Study Assistant. All rights reserved.</Copyright>
          <LegalLinks>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </LegalLinks>
        </BottomSection>
      </Inner>
    </Container>
  );
};

export default HomeFooter;