import React, { useEffect, useState, useCallback, memo } from 'react';
import { keyframes, styled } from 'styled-components';
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import useKeyPress from '../../hooks/useKeyPress';
import { MdRefresh } from 'react-icons/md';

interface ImageViewerProps {
  serverUrl: string;
  filePath: string | null;
}

type ImageViewerState = {
  imageUrl: string | null;
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
      z-index: 9999;
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
  justify-content: center;
  align-items: center;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #f1f5f9;
  
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const ImageContainer = styled.div<{$Rotate:number,$zoom: number}>`
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: auto;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  img {
    border-radius: 5px;
    max-width: 100%;
    max-height: 100%;
    transform: scale(${({$zoom}) => $zoom}) rotate(${({$Rotate}) => $Rotate+"deg"});
    transition: transform 0.2s ease;
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

const ImageViewer = memo(({ serverUrl, filePath }: ImageViewerProps) => {
  const [imageState, setImageState] = useState<ImageViewerState>({
    imageUrl: null,
    loading: true,
    error: null
  });
  
  const [zoom, setZoom] = useState<number>(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [Rotate,setRotate]=useState<number>(0);
  useKeyPress('Escape', () => setFullscreen(false));
  
  const loadImage = useCallback(async (abortSignal: AbortSignal) => {
    if (!filePath) {
      setImageState(prev => prev.imageUrl ? prev : {
        imageUrl: null,
        loading: false,
        error: 'No file path provided'
      });
      return;
    }

    try {
      setImageState(prev => prev.loading ? prev : { 
        ...prev, 
        loading: true, 
        error: null 
      });
      
      const endpoint = `${serverUrl}/get_file`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath }),
        signal: abortSignal
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load image: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      setImageState({
        imageUrl,
        loading: false,
        error: null
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      
      console.error('Error loading image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setImageState(prev => prev.loading ? {
        imageUrl: null,
        loading: false,
        error: errorMessage
      } : prev);
    }
  }, [serverUrl, filePath]);

  useEffect(() => {
    const abortController = new AbortController();
    
    if (filePath) {
      loadImage(abortController.signal);
    } else {
      setImageState({
        imageUrl: null,
        loading: false,
        error: null
      });
    }

    return () => {
      abortController.abort();
      if (imageState.imageUrl) {
        URL.revokeObjectURL(imageState.imageUrl);
      }
    };
  }, [filePath, loadImage]);
  
  const { imageUrl, loading, error } = imageState;
  
  if (loading) {
    return (
      <LoadingContainer>
        Loading image...
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <strong>Error loading image:</strong> {error}
      </ErrorContainer>
    );
  }
  
  return (
    <>
      {fullscreen && <Background />}
      <Main fullscreen={fullscreen}>
        <Global>
          <TopBar>
            <ControlButton 
              onClick={() => setRotate(Rotate+90)}
            >
              <MdRefresh size={22}/>
            </ControlButton>
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
              <ImageContainer $Rotate={Rotate} $zoom={zoom / 100}>
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    onError={(e) => {
                      setImageState({
                        imageUrl: null,
                        loading: false,
                        error: 'Failed to load image'
                      });
                    }}
                  />
                )}
              </ImageContainer>
            </DocumentWrapper>
          </Container>
        </Global>
      </Main>
    </>
  );
});

export default ImageViewer;