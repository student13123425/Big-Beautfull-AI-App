import React, { useEffect, useState, useCallback, memo } from 'react';
import { styled, keyframes } from 'styled-components';
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import useKeyPress from '../../hooks/useKeyPress';
import { loadDocumentContent } from '../../scripts/network';
import Loading from './Loading';

interface DocViewerProps {
  serverUrl: string;
  filePath: string | null;
}

type DocViewerState = {
  content: string;
  loading: boolean;
  error: string | null;
};

interface ContainerProps {
  fullscreen?: boolean;
}

const Global = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
  min-height: 0;
`;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 3000;
`;

const Main = styled.div<ContainerProps>`
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  margin: 10px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  
  ${({ fullscreen }) =>
    fullscreen &&
    `
      background-color:#fff;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: auto;
      z-index: 99999999;
      margin: 0;
      border-radius: 0;
      border: none;
    `}
`;

const Container = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  height: 3.5rem;
  width: 100%;
  justify-content: flex-end;
  padding: 0.625rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  gap: 10px;

  @media (max-width: 500px) {
    height: 2.5rem;
    padding: 0.4rem;
  }
`;

const ControlButton = styled.button<{ $active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${({ $active }) => $active ? '#1e40af' : 'rgba(255, 255, 255, 0.15)'};
  outline: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${({ $active }) => $active ? '#1d4ed8' : 'rgba(255, 255, 255, 0.25)'};
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 500px) {
    width: 2rem;
    height: 2rem;
    border-radius: 6px;
  }
`;

const ZoomControls = styled.div`
  display: flex;
  gap: 5px;
  height: 100%;
  align-items: center;

  @media (max-width: 500px) {
    display: none;
  }
`;

const ZoomDisplay = styled.div`
  font-size: 1.1rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  width: 80px;
  color: white;
  user-select: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const DocumentWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background-color: #f1f5f9;
  
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const DocumentContent = styled.div<{$zoom:number}>`
  width: 100%;
  padding: 1.5rem;
  margin: 0 auto;
  background: white;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  min-height: 100%;
  box-sizing: border-box;
  
  h1 {
    color: #1e293b;
    font-weight: 600;
    text-align: center;
    margin: ${({$zoom})=>1.5*$zoom}rem 0;
    font-size: ${({$zoom})=>2.2*$zoom}rem;
    padding-bottom: ${({$zoom})=>0.5*$zoom}rem;
    border-bottom: 1px solid #e2e8f0;
  }

  h2 {
    color: #2563eb;
    font-weight: 500;
    margin: ${({$zoom})=>1.2*$zoom}rem 0 ${({$zoom})=>0.8*$zoom}rem;
    font-size: ${({$zoom})=>1.8*$zoom}rem;
    padding-bottom: ${({$zoom})=>0.3*$zoom}rem;
    border-bottom: 1px solid #e2e8f0;
  }

  h3 {
    color: #3b82f6;
    font-weight: 500;
    margin: ${({$zoom})=>1*$zoom}rem 0 ${({$zoom})=>0.6*$zoom}rem;
    font-size: ${({$zoom})=>1.4*$zoom}rem;
  }

  p {
    margin: ${({$zoom})=>0.8*$zoom}rem 0;
    line-height: 1.6;
    color: #334155;
    font-size: ${({$zoom})=>1.1*$zoom}rem;
  }

  strong {
    font-weight: 600;
    color: #1e293b;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${({$zoom})=>1.2*$zoom}rem 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid #e2e8f0;
  }

  tr {
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.2s;
  }

  tr:hover {
    background-color: #f8fafc;
  }

  th {
    background-color: #3b82f6;
    color: white;
    font-weight: 500;
    text-align: left;
    padding: ${({$zoom})=>0.8*$zoom}rem ${({$zoom})=>1*$zoom}rem;
  }

  td {
    padding: ${({$zoom})=>0.7*$zoom}rem ${({$zoom})=>1*$zoom}rem;
    vertical-align: top;
  }

  ul, ol {
    margin: ${({$zoom})=>0.8*$zoom}rem 0;
    padding-left: ${({$zoom})=>1.8*$zoom}rem;
  }

  li {
    margin-bottom: ${({$zoom})=>0.5*$zoom}rem;
    line-height: 1.6;
    font-size: ${({$zoom})=>1.1*$zoom}rem;
  }

  blockquote {
    border-left: 4px solid #3b82f6;
    padding: ${({$zoom})=>0.5*$zoom}rem ${({$zoom})=>1*$zoom}rem;
    margin: ${({$zoom})=>1*$zoom}rem 0;
    background-color: #f8fafc;
    color: #475569;
    font-style: italic;
  }

  pre {
    background-color: #1e293b;
    color: #e2e8f0;
    padding: ${({$zoom})=>1*$zoom}rem;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Consolas', monospace;
    margin: ${({$zoom})=>1.2*$zoom}rem 0;
  }

  img {
    max-width: 100%;
    height: auto;
    margin: ${({$zoom})=>0.8*$zoom}rem auto;
    display: block;
    border-radius: 4px;
  }
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #64748b;
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background-color: #fef2f2;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const DocViewer = memo(({ serverUrl, filePath }: DocViewerProps) => {
  const [docState, setDocState] = useState<DocViewerState>({
    content: '',
    loading: true,
    error: null
  });
  const [zoom, setZoom] = useState<number>(100);
  const [fullscreen, setFullscreen] = useState(false);
  
  useKeyPress('Escape', () => setFullscreen(false));
  
  const loadDocument = useCallback(async (abortSignal: AbortSignal) => {
    if (!filePath) {
      setDocState(prev => prev.content ? prev : {
        content: '',
        loading: false,
        error: 'No file path provided'
      });
      return;
    }

    try {
      setDocState(prev => prev.loading ? prev : { 
        ...prev, 
        loading: true, 
        error: null 
      });
      
      const content = await loadDocumentContent({
        serverUrl,
        filePath,
        abortSignal
      });
      
      setDocState({
        content,
        loading: false,
        error: null
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      
      console.error('Error loading document:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setDocState(prev => prev.loading ? {
        content: '',
        loading: false,
        error: errorMessage
      } : prev);
    }
  }, [serverUrl, filePath]);

  useEffect(() => {
    const abortController = new AbortController();
    
    if (filePath) {
      loadDocument(abortController.signal);
    } else {
      setDocState({
        content: '',
        loading: false,
        error: null
      });
    }

    return () => {
      abortController.abort();
    };
  }, [filePath, loadDocument]);
  
  const { content, loading, error } = docState;
  
  if (loading) 
    return <Loading filePath={filePath?filePath:"null"}/>

  if (error) {
    return (
      <ErrorContainer>
        <strong>Error loading document:</strong> {error}
      </ErrorContainer>
    );
  }

  return (
    <>
      {fullscreen && <Background />}
      <Main fullscreen={fullscreen}>
        <Global>
          <TopBar>
            <ZoomControls>
              <ControlButton 
                onClick={() => setZoom(prev => Math.max(20, prev - 20))}
                disabled={zoom <= 20}
              >
                <ZoomOut size={20}/>
              </ControlButton>
              <ZoomDisplay>{zoom}%</ZoomDisplay>
              <ControlButton 
                onClick={() => setZoom(prev => Math.min(200, prev + 20))}
                disabled={zoom >= 200}
              >
                <ZoomIn size={20}/>
              </ControlButton>
            </ZoomControls>          
            <ControlButton 
              onClick={() => setFullscreen(!fullscreen)}
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </ControlButton>
          </TopBar>
          <Container>
            <DocumentWrapper>
              <DocumentContent 
                $zoom={zoom/100} 
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            </DocumentWrapper>
          </Container>
        </Global>
      </Main>
    </>
  );
});

export default DocViewer;