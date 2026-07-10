import React, { useEffect, useState, useCallback, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { MaterieImgGroup } from '../../scripts/objects';

interface ImageGroupViewerProps {
  group: MaterieImgGroup;
  serverUrl: string;
  userId?: string | null;
  onClose?: () => void;
}

type ImageState = {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div<{ $fullscreen?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #f8fafc;
  overflow: hidden;
  ${({ $fullscreen }) =>
    $fullscreen && `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
    `}
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const GroupTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TopBarActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const IconButton = styled.button<{ $variant?: 'default' | 'icon' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: ${({ $variant }) => ($variant === 'icon' ? '2rem' : 'auto')};
  height: ${({ $variant }) => ($variant === 'icon' ? '2rem' : '2.5rem')};
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${({ $variant }) => ($variant === 'icon' ? '1rem' : '0.9rem')};
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const ImageViewerArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  position: relative;
  min-height: 0;
`;

const ImageWrapper = styled.div<{ $zoom: number }>`
  display: inline-block;
  max-width: 100%;
  max-height: 100%;
  transform: scale(${({ $zoom }) => $zoom});
  transition: transform 0.2s ease;
`;

const MainImage = styled.img`
  max-width: 100%;
  max-height: calc(100vh - 25rem);
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: white;
`;

const NavigationOverlay = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ZoomText = styled.span`
  font-size: 0.85rem;
  color: #3b82f6;
  font-weight: 600;
  min-width: 45px;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ThumbnailsStrip = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  overflow-x: auto;
  overflow-y: hidden;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
`;

const Thumbnail = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid ${({ $active }) => ($active ? '#3b82f6' : '#e2e8f0')};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #94a3b8;
    transform: scale(1.05);
  }
`;

const ThumbnailImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #64748b;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background-color: #fef2f2;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  span {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${fadeIn} 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ImageGroupViewer = memo(({ group, serverUrl, userId, onClose }: ImageGroupViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageStates, setImageStates] = useState<ImageState[]>([]);
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);

  const loadImage = useCallback(async (index: number) => {
    if (!group.images[index]) return;
    
    const imagePath = group.images[index].path;
    if (!imagePath) {
      setImageStates(prev => {
        const newStates = [...prev];
        newStates[index] = { imageUrl: null, loading: false, error: 'No path provided' };
        return newStates;
      });
      return;
    }

    setImageStates(prev => {
      const newStates = [...prev];
      newStates[index] = { ...newStates[index], loading: true, error: null };
      return newStates;
    });

    try {
      const body: { path: string; userId?: string } = { path: imagePath };
      if (userId) body.userId = userId;

      const response = await fetch(`${serverUrl}/get_file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Failed to load image: ${response.statusText}`);

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setImageStates(prev => {
        const newStates = [...prev];
        newStates[index] = { imageUrl, loading: false, error: null };
        return newStates;
      });
    } catch (err: any) {
      setImageStates(prev => {
        const newStates = [...prev];
        newStates[index] = { 
          imageUrl: prev[index]?.imageUrl || null, 
          loading: false, 
          error: err.message || 'Failed to load image' 
        };
        return newStates;
      });
    }
  }, [group.images, serverUrl, userId]);

  useEffect(() => {
    const initialStates = group.images.map((_, i) => ({
      imageUrl: null as string | null,
      loading: false,
      error: null as string | null,
    }));
    setImageStates(initialStates);

    if (group.images.length > 0 && group.images[currentIndex]) {
      loadImage(currentIndex);
    }

    return () => {
      imageStates.forEach(state => {
        if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
      });
    };
  }, []);

  useEffect(() => {
    loadImage(currentIndex);
  }, [currentIndex, loadImage]);

  const goToPrev = useCallback(() => {
    setZoom(100);
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    setZoom(100);
    if (currentIndex < group.images.length - 1) setCurrentIndex(prev => prev + 1);
  }, [currentIndex, group.images.length]);

  const selectImage = useCallback((index: number) => {
    setZoom(100);
    setCurrentIndex(index);
  }, []);

  const currentImageState = imageStates[currentIndex];
  const currentImagePath = group.images[currentIndex]?.path;

  if (group.images.length === 0) {
    return (
      <Container $fullscreen={fullscreen}>
        <EmptyState>
          <span>🖼️</span>
          <p>No images in this group</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container $fullscreen={fullscreen}>
      {fullscreen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: -1,
          }}
          onClick={() => setFullscreen(false)}
        />
      )}

      <TopBar>
        <GroupTitle>
          🖼️ {group.title || 'Image Group'}
        </GroupTitle>
        <TopBarActions>
          <ZoomControls>
            <IconButton $variant="icon" onClick={() => setZoom(z => Math.max(20, z - 20))} disabled={zoom <= 20}>
              <ZoomOut size={16} />
            </IconButton>
            <ZoomText>{zoom}%</ZoomText>
            <IconButton $variant="icon" onClick={() => setZoom(z => Math.min(200, z + 20))} disabled={zoom >= 200}>
              <ZoomIn size={16} />
            </IconButton>
          </ZoomControls>
          <IconButton $variant="icon" onClick={() => setFullscreen(!fullscreen)}>
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </IconButton>
          {onClose && (
            <IconButton $variant="icon" onClick={onClose}>
              <X size={18} />
            </IconButton>
          )}
        </TopBarActions>
      </TopBar>

      <MainArea>
        <ImageViewerArea>
          {currentImageState?.loading && (
            <LoadingContainer>
              <Spinner />
              <span>Loading image...</span>
            </LoadingContainer>
          )}

          {currentImageState?.error && !currentImageState.imageUrl && (
            <ErrorContainer>
              <strong>Error:</strong> {currentImageState.error}
            </ErrorContainer>
          )}

          {currentImagePath && currentImageState?.imageUrl && (
            <>
              <NavigationOverlay style={{ left: '1rem' }}>
                <NavButton onClick={goToPrev} disabled={currentIndex === 0}>
                  <ChevronLeft size={24} />
                </NavButton>
              </NavigationOverlay>
              
              <ImageCounter>
                {currentIndex + 1} / {group.images.length}
              </ImageCounter>

              <NavigationOverlay style={{ right: '1rem' }}>
                <NavButton onClick={goToNext} disabled={currentIndex >= group.images.length - 1}>
                  <ChevronRight size={24} />
                </NavButton>
              </NavigationOverlay>

              <ImageWrapper $zoom={zoom / 100}>
                <MainImage 
                  src={currentImageState.imageUrl} 
                  alt={`${group.title} - Image ${currentIndex + 1}`}
                  onError={() => {
                    setImageStates(prev => {
                      const newStates = [...prev];
                      newStates[currentIndex] = { ...newStates[currentIndex], error: 'Failed to load image' };
                      return newStates;
                    });
                  }}
                />
              </ImageWrapper>
            </>
          )}

          {!currentImagePath && !currentImageState?.loading && (
            <EmptyState>
              <span>📷</span>
              <p>No image path available</p>
            </EmptyState>
          )}
        </ImageViewerArea>

        {group.images.length > 1 && (
          <ThumbnailsStrip>
            {group.images.map((_, index) => {
              const state = imageStates[index];
              return (
                <Thumbnail 
                  key={index} 
                  $active={index === currentIndex}
                  onClick={() => selectImage(index)}
                >
                  {state?.imageUrl ? (
                    <ThumbnailImg src={state.imageUrl} alt={`Thumb ${index + 1}`} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>
                      {index + 1}
                    </div>
                  )}
                </Thumbnail>
              );
            })}
          </ThumbnailsStrip>
        )}
      </MainArea>
    </Container>
  );
});

export default ImageGroupViewer;