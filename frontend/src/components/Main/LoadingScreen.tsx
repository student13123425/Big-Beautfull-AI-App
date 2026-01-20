import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 10px solid rgba(224, 224, 224, 0.5);
  border-top: 10px solid #3498db;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const IconBase = styled.div`
  position: absolute;
  font-size: 28px;
  animation: orbit 4s linear infinite, pulse 1.5s ease-in-out infinite alternate;

  @keyframes orbit {
    0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
  }

  @keyframes pulse {
    0% { opacity: 0.7; transform: scale(1); }
    100% { opacity: 1; transform: scale(1.1); }
  }
`;

const BookIcon = styled(IconBase)`
  animation-delay: 0s, 0s;
  top: 50%;
  left: 50%;
`;

const PencilIcon = styled(IconBase)`
  animation-delay: -1.333s, 0.5s;
  top: 50%;
  left: 50%;
`;

const BrainIcon = styled(IconBase)`
  animation-delay: -2.666s, 1s;
  top: 50%;
  left: 50%;
`;

const NotebookIcon = styled(IconBase)`
  animation-delay: -0.666s, 0.25s;
  top: 50%;
  left: 50%;
`;

const LightbulbIcon = styled(IconBase)`
  animation-delay: -3.333s, 1.25s;
  top: 50%;
  left: 50%;
`;

const LoadingText = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  text-align: center;
  letter-spacing: 0.5px;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Dots = styled.span`
  display: inline-block;
  width: 1em;
  text-align: left;
  overflow: hidden;
  vertical-align: bottom;

  &::after {
    content: '...';
    display: inline-block;
    animation: dots 1.5s steps(4, end) infinite;
    width: 0;
    overflow: hidden;
  }

  @keyframes dots {
    0% { width: 0; }
    25% { width: 0.333em; }
    50% { width: 0.666em; }
    75% { width: 1em; }
    100% { width: 0; }
  }
`;

const FunMessage = styled.p`
  font-size: 18px;
  color: #7f8c8d;
  margin-top: 15px;
  text-align: center;
  max-width: 400px;
  padding: 0 20px;
  opacity: 0;
  animation: messageFade 2s ease-in-out infinite;

  @keyframes messageFade {
    0% { opacity: 0; transform: translateY(5px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-5px); }
  }
`;

const SubtleBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  animation: bgPulse 5s ease-in-out infinite;

  @keyframes bgPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

export default function LoadingScreen() {
  const [funMessage, setFunMessage] = useState<string>('');

  useEffect(() => {
    const messages = [
      'Brewing up intelligent summaries for your study session...',
      'Assembling quiz questions with superhero precision...',
      'Deploying knowledge payloads to supercharge your brain...',
      'Our AI is cramming more efficiently than a college all-nighter...',
      'Retrieving documents at warp speed for your academic arsenal...',
      'Synthesizing insights from your files – hold tight...',
      'Generating personalized quizzes to test your mastery...',
      'Loading educational firepower for exam domination...',
      'AI algorithms optimizing your learning experience...',
      'Fetching resources faster than a deadline approaches...'
    ];
    setFunMessage(messages[Math.floor(Math.random() * messages.length)]);
    const interval = setInterval(() => {
      setFunMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingContainer role="progressbar" aria-label="Loading study materials">
      <SubtleBackground />
      <SpinnerWrapper>
        <Spinner />
        <BookIcon style={{ animationDelay: '0s, 0s' }}>📖</BookIcon>
        <PencilIcon style={{ animationDelay: '-1.333s, 0.5s' }}>✏️</PencilIcon>
        <BrainIcon style={{ animationDelay: '-2.666s, 1s' }}>🧠</BrainIcon>
        <NotebookIcon style={{ animationDelay: '-0.666s, 0.25s' }}>📓</NotebookIcon>
        <LightbulbIcon style={{ animationDelay: '-3.333s, 1.25s' }}>💡</LightbulbIcon>
      </SpinnerWrapper>
      <LoadingText>Loading your study materials<Dots /></LoadingText>
      <FunMessage>{funMessage}</FunMessage>
    </LoadingContainer>
  );
}