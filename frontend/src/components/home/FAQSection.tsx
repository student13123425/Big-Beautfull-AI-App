import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.section`
  padding: 6rem 2rem;
  background: #ffffff;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ede9fe;
  color: #7c3aed;
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
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
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
  margin: 0 auto 3rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
`;

const FAQItem = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  margin-bottom: 1rem;
  border: 1px solid #e8ecf4;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #c4b5fd;
  }
`;

const QuestionButton = styled.button<{ $open: boolean }>`
  width: 100%;
  padding: 1.5rem 2rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  
  span {
    font-size: 1.1rem;
    font-weight: 600;
    color: #0f172a;
    font-family: 'Inter', sans-serif;
  }
  
  svg {
    color: #7c3aed;
    flex-shrink: 0;
    transition: transform 0.3s ease;
    transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const Answer = styled.div<{ $open: boolean }>`
  max-height: ${props => props.$open ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease;
  padding: ${props => props.$open ? '0 2rem 1.5rem' : '0 2rem'};
  
  p {
    font-size: 1rem;
    color: #64748b;
    line-height: 1.7;
    margin: 0;
  }
`;

const FAQData = [
  {
    question: 'What file formats are supported?',
    answer: 'We support PDF, DOCX (Word documents), PPTX (PowerPoint presentations), JPG/PNG images, and plain text files. You can upload multiple files at once for comprehensive study materials.',
  },
  {
    question: 'How does the AI summary generation work?',
    answer: 'Our AI analyzes your uploaded documents using advanced natural language processing models. It identifies key concepts, structures information hierarchically, and generates comprehensive summaries that capture the essential points of your material.',
  },
  {
    question: 'Can I create custom quizzes from my materials?',
    answer: 'Yes! You can generate multiple-choice quizzes from any uploaded document. Customize the number of questions, difficulty level, and topics you want to be tested on. The AI creates relevant questions based on your actual study content.',
  },
  {
    question: 'Is my data safe and private?',
    answer: 'Absolutely. All uploaded documents are processed securely and stored encrypted. We never share your data with third parties. You can delete your account and all associated data at any time.',
  },
  {
    question: 'How much does it cost?',
    answer: 'The basic features are completely free for students, including document upload, AI summaries, and quiz generation. Premium features with advanced analytics and unlimited uploads are available through an affordable student subscription plan.',
  },
  {
    question: 'Can I use this on my mobile device?',
    answer: 'Yes! Our web application is fully responsive and works great on smartphones, tablets, laptops, and desktop computers. Study anywhere, anytime without needing to install any additional apps.',
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Container>
      <Inner>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <SectionBadge>❓ FAQ</SectionBadge>
        </div>
        <SectionTitle>
          Frequently Asked{' '}
          <span className="highlight">Questions</span>
        </SectionTitle>
        <SectionSubtitle>
          Everything you need to know about the AI Study Assistant.
        </SectionSubtitle>

        {FAQData.map((faq, index) => (
          <FAQItem key={index}>
            <QuestionButton
              $open={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span>{faq.question}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </QuestionButton>
            <Answer $open={openIndex === index}>
              <p>{faq.answer}</p>
            </Answer>
          </FAQItem>
        ))}
      </Inner>
    </Container>
  );
};

export default FAQSection;