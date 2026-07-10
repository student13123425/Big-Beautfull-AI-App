import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const rotateForward = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const rotateBackward = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const dots = keyframes`
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
`;

const textFade = keyframes`
  0%, 100% { opacity: 0; transform: translateY(4px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const BackgroundContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
`;

const ContentCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 50px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  min-width: 420px;
`;

const SyncStage = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Central Hub (The User's Workspace)
const CentralHub = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: white;
  z-index: 10;
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

// Data Rings (Backend Syncing)
const SyncRing = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
`;

const InnerRing = styled(SyncRing)`
  width: 100px;
  height: 100px;
  border-top: 2px dashed #93c5fd;
  border-right: 2px dashed #93c5fd;
  animation: ${rotateForward} 8s linear infinite;
`;

const OuterRing = styled(SyncRing)`
  width: 150px;
  height: 150px;
  border-bottom: 2px dashed #bfdbfe;
  border-left: 2px dashed #bfdbfe;
  animation: ${rotateBackward} 12s linear infinite;
`;

// Data Modules (Folders, Progress, Settings)
const ModuleIcon = styled.div`
  position: absolute;
  width: 36px;
  height: 36px;
  background: #ffffff;
  border: 2px solid #eff6ff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  z-index: 15;
`;

const Module1 = styled(ModuleIcon)`
  top: 0;
  left: 50%;
  margin-left: -18px;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: 0s;
`;

const Module2 = styled(ModuleIcon)`
  bottom: 15px;
  right: 5px;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: 1s;
`;

const Module3 = styled(ModuleIcon)`
  bottom: 15px;
  left: 5px;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: 2s;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
  text-align: center;
`;

const Dots = styled.span`
  display: inline-block;
  width: 24px;
  text-align: left;
  &::after {
    content: '';
    animation: ${dots} 1.5s steps(4, end) infinite;
  }
`;

const SubtitleWrapper = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  animation: ${textFade} 2.5s ease-in-out infinite;
`;

export default function WorkspaceLoadingScreen() {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    // Messages tailored specifically for backend data fetching
    const syncMessages = [
      'Establishing secure connection',
      'Retrieving your study history',
      'Syncing subject folders',
      'Loading progress analytics',
      'Configuring your AI workspace'
    ];
    
    setCurrentText(syncMessages[0]);
    let index = 1;
    
    const interval = setInterval(() => {
      setCurrentText(syncMessages[index]);
      index = (index + 1) % syncMessages.length;
    }, 2500); // Matches the textFade animation duration
    
    return () => clearInterval(interval);
  }, []);

  return (
    <BackgroundContainer role="progressbar" aria-label="Loading workspace data">
      <ContentCard>
        
        <SyncStage>
          <OuterRing />
          <InnerRing />
          
          <Module1>📁</Module1>
          <Module2>📈</Module2>
          <Module3>⚙️</Module3>

          <CentralHub>🎓</CentralHub>
        </SyncStage>

        <Title>Loading Workspace<Dots /></Title>
        
        <SubtitleWrapper>
          <Subtitle key={currentText}>{currentText}</Subtitle>
        </SubtitleWrapper>

      </ContentCard>
    </BackgroundContainer>
  );
}