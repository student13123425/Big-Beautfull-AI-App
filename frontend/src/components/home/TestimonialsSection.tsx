import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaQuoteLeft } from 'react-icons/fa';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fef3c7;
  color: #d97706;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 0.3px;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1rem;
  text-align: center;
  letter-spacing: -0.5px;
  
  .highlight {
    background: linear-gradient(135deg, #d97706, #b45309);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.15rem;
  color: #64748b;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 3rem;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const TestimonialCard = styled.div<{ $delay?: number }>`
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8ecf4;
  position: relative;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.7s ease-out;
  animation-delay: ${props => props.$delay || 0}s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(217, 119, 6, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: #fde68a;
  font-size: 2rem;
  opacity: 0.5;
`;

const QuoteText = styled.p`
  font-size: 1rem;
  color: #475569;
  line-height: 1.7;
  margin: 0 0 1.5rem;
  font-style: italic;
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const AuthorName = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem;
`;

const AuthorRole = styled.span`
  font-size: 0.85rem;
  color: #94a3b8;
`;

const StarRating = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 1rem;
  
  span {
    color: #fbbf24;
    font-size: 1.1rem;
  }
`;

const TestimonialsData = [
  {
    quote: 'This app completely changed how I study for exams. The AI summaries are incredibly accurate and save me hours of reading through thick textbooks.',
    name: 'Maria Popescu',
    role: 'Medical Student, UMF Carol Davescu',
    avatar: '👩‍⚕️',
    avatarBg: '#fef2f2',
  },
  {
    quote: 'The quiz generation feature is a game-changer. I can test myself on any topic just by uploading my lecture notes. My grades improved significantly!',
    name: 'Andrei Dumitrescu',
    role: 'Computer Science, UPB Bucharest',
    avatar: '👨‍💻',
    avatarBg: '#eff6ff',
  },
  {
    quote: 'As a working student, I barely have time to read textbooks. This tool helps me create study materials from my lecture slides in minutes. Absolutely essential!',
    name: 'Elena Ionescu',
    role: 'Law Student, UNB Bucharest',
    avatar: '👩‍⚖️',
    avatarBg: '#f0fdf4',
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <Container>
      <Inner>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <SectionBadge>⭐ Testimonials</SectionBadge>
        </div>
        <SectionTitle>
          Loved by{' '}
          <span className="highlight">Students Everywhere</span>
        </SectionTitle>
        <SectionSubtitle>
          Join thousands of students who are already using AI to study smarter.
        </SectionSubtitle>

        <TestimonialsGrid>
          {TestimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} $delay={index * 0.15}>
              <QuoteIcon><FaQuoteLeft /></QuoteIcon>
              <StarRating>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </StarRating>
              <QuoteText>"{testimonial.quote}"</QuoteText>
              <AuthorSection>
                <Avatar style={{ background: testimonial.avatarBg }}>
                  {testimonial.avatar}
                </Avatar>
                <div>
                  <AuthorName>{testimonial.name}</AuthorName>
                  <AuthorRole>{testimonial.role}</AuthorRole>
                </div>
              </AuthorSection>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </Inner>
    </Container>
  );
};

export default TestimonialsSection;