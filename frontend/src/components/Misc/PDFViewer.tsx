import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Maximize2, FileText, Minimize2, ZoomIn, ZoomOut, Fullscreen } from 'lucide-react';
import styled, { keyframes, css } from 'styled-components';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import PptxGenJS from 'pptxgenjs';
import { fetchFileFromServer, getFileType } from '../../scripts/network';
import useKeyRelease from '../../hooks/useKeyRelease';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import Loading from './Loading';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PDFDocumentProxy {
  numPages: number;
  getPage(pageNumber: number): Promise<PDFPageProxy>;
}

interface PDFPageProxy {
  getViewport(params: { scale: number; rotation?: number }): PDFPageViewport;
  render(renderContext: RenderContext): RenderTask;
}

interface PDFPageViewport {
  width: number;
  height: number;
}

interface RenderContext {
  canvasContext: CanvasRenderingContext2D;
  viewport: PDFPageViewport;
}

interface RenderTask {
  promise: Promise<void>;
  cancel(): void;
}

// Animation keyframes
const slideInFromRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInFromLeft = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideOutToLeft = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-100%); opacity: 0; }
`;

const slideOutToRight = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
`;

const Container = styled.div<{ fullscreen?: boolean }>`
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: #ffffff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  ${(props) =>
    props.fullscreen
      ? css`
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          padding: 0;
          margin: 0;
          border-radius: 0;
          box-shadow: none;
          z-index: 9999999;
          background-color: #ffffff;
        `
      : css`
          width: calc(100% - 20px);
          height: calc(100% - 20px);
          margin: 10px;
          border-radius: 8px;
        `}
`;

const ContainerInner = styled.div`
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
`;

const Header = styled.div`
  display: flex;
  height: 3.5rem;
  justify-content: space-between;
  padding: 0.625rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);

  @media (max-width: 500px) {
    height: 2.5rem;
    padding: 0.4rem;
  }
`;

const Controls = styled.div`
  display: flex;
  height: 100%;
  gap: 0.25rem;
  align-items: center;

  &:last-of-type span {
    display: none;
  }
`;

const ControlButton = styled.button<{ $active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${({ $active }) => ($active ? '#1e40af' : 'rgba(255, 255, 255, 0.15)')};
  outline: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ $active }) => ($active ? '#1d4ed8' : 'rgba(255, 255, 255, 0.25)')};
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

const PageInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  height: 2.4rem;

  span {
    color: #fff;
    font-family: 'Inter', sans-serif;
  }

  @media (max-width: 500px) {
    height: 1.8rem;
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
  }
`;

const PageInput = styled.input`
  width: fit-content;
  text-align: center;
  border: none;
  background: transparent;
  color: #ffffff;
  font-weight: 500;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &:focus {
    outline: none;
  }

  @media (max-width: 500px) {
    font-size: 0.75rem;
  }
`;

const ZoomControls = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;

  @media (max-width: 500px) {
    display: none;
  }
`;

const ScaleDisplay = styled.div`
  padding: 0.25rem 0.5rem;
  min-width: 4rem;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  height: 100%;
  display: flex;
  width: 80px;
  height: 2.5rem;
  user-select: none;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
`;

const Divider = styled.div`
  width: 1px;
  height: 1.5rem;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 0.5rem;

  @media (max-width: 500px) {
    height: 1.2rem;
    margin: 0 0.3rem;
  }
`;

const Footer = styled.div`
  display: flex;
  height: 3rem;
  width: 100%;
  align-items: center;
  padding: 0 0.75rem;
  justify-content: space-between;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 500px) {
    height: 2rem;
    padding: 0 0.5rem;
  }
`;

const FilePath = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;

  @media (max-width: 500px) {
    font-size: 0.65rem;
    gap: 0.3rem;
  }
`;

const PageInfo = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Inter', sans-serif;

  @media (max-width: 500px) {
    font-size: 0.65rem;
  }
`;

const PdfContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  background-color: #f1f5f9;
  overflow: auto;
  min-height: 0;
  align-items: center;
  
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  *{
    transition: all 0.1s ease;
  }
`;

const CanvasWrapper = styled.div<{ $direction: 'left' | 'right' | 'none'; $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ $direction, $isActive }) => {
    if (!$isActive) {
      if ($direction === 'left') {
        return css`animation: ${slideOutToLeft} 0.3s ease forwards;`;
      } else if ($direction === 'right') {
        return css`animation: ${slideOutToRight} 0.3s ease forwards;`;
      }
      return css`opacity: 0;`;
    } else {
      if ($direction === 'left') {
        return css`animation: ${slideInFromLeft} 0.3s ease forwards;`;
      } else if ($direction === 'right') {
        return css`animation: ${slideInFromRight} 0.3s ease forwards;`;
      }
      return css`opacity: 1;`;
    }
  }}
`;

const Canvas = styled.canvas`
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 100%;
  height: auto;
  max-width: 100%;
  height: fit-content !important;
`;

const NoFileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
  width: 100%;
  height: 100%;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
  width: 100%;
  height: 100%;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #fff5f5, #f1f5f9);
  width: 100%;
  height: 100%;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
`;

const LoadingSpinner = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  &::after {
    content: '';
    display: block;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: 4px solid #e2e8f0;
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const RetryButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #3b82f6;
  color: #ffffff;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'Inter', sans-serif;
  margin-top: 1rem;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const Hide = styled.div`
  display: none;
`;

interface PDFViewerProps {
  filePath?: string;
  serverUrl?: string;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  filePath,
  serverUrl = "http://localhost:3000",
  className = ""
}) => {
  console.log(pdfjsWorker);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const currentRenderTaskRef = useRef<RenderTask | null>(null);
  const prevRenderTaskRef = useRef<RenderTask | null>(null);

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pptx, setPptx] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [fitToWidth, setFitToWidth] = useState<boolean>(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | 'none'>('none');
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [fileType, setFileType] = useState<'pdf' | 'pptx' | null>(null);
  const [IsFirstUse, setIsFirstUse] = useState<boolean>(true);
  useKeyRelease("Escape",()=>setFullscreen(false))
  useEffect(() => {
    setIsFirstUse(true);
    setTimeout(() => {
      setIsFirstUse(false);
    }, 0);
  }, []);

  // Debounce function to limit resize event frequency
  function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    const debounced = function (...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
    debounced.cancel = () => {
      clearTimeout(timeout);
    };
    return debounced;
  }

  // Handle resize with memoized callback
  const handleResize = useCallback(() => {
    if (!fileType || loading) return;
    if (fileType === 'pdf' && pdf) {
      renderPdfPage(currentPage, canvasRef.current, currentRenderTaskRef);
    } else if (fileType === 'pptx' && pptx) {
      renderPptxSlide(currentPage - 1, canvasRef.current!);
    }
  }, [pdf, pptx, currentPage, scale, rotation, fitToWidth, fileType, loading,fullscreen]);
  console.log(fullscreen);
  
  // Create debounced version of handleResize
  const debouncedHandleResize = useMemo(() => debounce(handleResize, 200), [handleResize]);

  const renderPptxSlide = async (slideIndex: number, canvas: HTMLCanvasElement): Promise<void> => {
    if (!pptx || !canvas) return;

    try {
      const slide = pptx.getSlide(slideIndex);
      if (!slide) return;

      const context = canvas.getContext('2d');
      if (!context) throw new Error('Unable to get canvas context');

      const viewerWidth = viewerRef.current?.clientWidth || 800;
      const viewerHeight = viewerRef.current?.clientHeight || 600;

      const slideLayout = pptx.getLayout();
      const slideNativeWidth = slideLayout.width || 960;
      const slideNativeHeight = slideLayout.height || 540;

      let finalWidth, finalHeight;

      if (fitToWidth) {
        finalWidth = viewerWidth - 32;
        finalHeight = (finalWidth / slideNativeWidth) * slideNativeHeight;
      } else {
        finalWidth = slideNativeWidth * scale;
        finalHeight = slideNativeHeight * scale;
      }

      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = finalWidth * devicePixelRatio;
      canvas.height = finalHeight * devicePixelRatio;
      canvas.style.width = `${finalWidth}px`;
      canvas.style.height = `${finalHeight}px`;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = slideNativeWidth;
      offscreenCanvas.height = slideNativeHeight;
      const offscreenCtx = offscreenCanvas.getContext('2d');

      if (!offscreenCtx) throw new Error('Failed to create offscreen canvas');

      await slide.render(offscreenCtx);

      context.drawImage(
        offscreenCanvas,
        0, 0, slideNativeWidth, slideNativeHeight,
        0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio
      );
    } catch (err) {
      console.error('Error rendering PPTX slide:', err);
      setError('Failed to render PPTX slide');
    }
  };

  useEffect(() => {
    if (!filePath||IsFirstUse) return;

    const loadFile = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const fileData = await fetchFileFromServer(filePath, serverUrl);
        const type = getFileType(filePath);
        setFileType(type);

        if (type === 'pdf') {
          const loadingTask = pdfjsLib.getDocument(fileData);
          const pdfDoc = await loadingTask.promise;
          setPdf(pdfDoc);
          setTotalPages(pdfDoc.numPages);
          setCurrentPage(1);
        } else {
          const pptxInstance = new PptxGenJS();
          await pptxInstance.load(fileData);
          setPptx(pptxInstance);
          setTotalPages(pptxInstance.slides.length);
          setCurrentPage(1);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading file:', err);
        setError(err instanceof Error ? `Failed to load file: ${err.message}` : 'Failed to load file');
        setLoading(false);
      }
    };

    loadFile();
  }, [filePath, serverUrl,IsFirstUse]);
  
  useEffect(() => {
    if (!fileType || loading||IsFirstUse) return;
    if (fileType === 'pdf' && pdf) {
      renderPdfPage(currentPage, canvasRef.current, currentRenderTaskRef);
    } else if (fileType === 'pptx' && pptx) {
      renderPptxSlide(currentPage - 1, canvasRef.current!);
    }
  }, [pdf, pptx, currentPage, scale, rotation, fitToWidth, fileType, loading, IsFirstUse,fullscreen]);
  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      debouncedHandleResize.cancel();
    };
  }, [debouncedHandleResize]);

  const renderPdfPage = async (
    pageNum: number,
    canvas: HTMLCanvasElement | null,
    taskRef: React.MutableRefObject<RenderTask | null>
  ): Promise<void> => {
    if (!pdf || !canvas || !viewerRef.current) return;

    try {
      if (taskRef.current) {
        taskRef.current.cancel();
        taskRef.current = null;
      }

      const page = await pdf.getPage(pageNum);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Unable to get canvas context');

      const viewerWidth = viewerRef.current.clientWidth;
      const viewerHeight = viewerRef.current.clientHeight;

      const viewport = page.getViewport({ scale: 1, rotation });

      let finalScale: number;
      if (fitToWidth) {
        finalScale = (viewerWidth - 32) / viewport.width;
      } else {
        const scaleX = (viewerWidth - 32) / viewport.width;
        const scaleY = (viewerHeight - 32) / viewport.height;
        finalScale = scale * Math.min(scaleX, scaleY);
      }

      const scaledViewport = page.getViewport({ scale: finalScale, rotation });

      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = scaledViewport.width * devicePixelRatio;
      canvas.height = scaledViewport.height * devicePixelRatio;
      canvas.style.width = scaledViewport.width + 'px';
      canvas.style.height = scaledViewport.height + 'px';

      context.scale(devicePixelRatio, devicePixelRatio);
      context.clearRect(0, 0, canvas.width, canvas.height);

      const renderTask = page.render({
        canvasContext: context,
        viewport: scaledViewport,
      });

      taskRef.current = renderTask;

      await renderTask.promise;

      taskRef.current = null;
    } catch (err) {
      if (err instanceof Error && err.message === 'Rendering cancelled') {
        console.log('Render cancelled');
      } else {
        console.error('Error rendering PDF page:', err);
        // setError('Failed to render PDF page');
      }
    }
  };

  const goToPage = (pageNum: number): void => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      const direction = pageNum > currentPage ? 'right' : 'left';
      setTransitionDirection(direction);
      setPrevPage(currentPage);

      if (prevCanvasRef.current && fileType === 'pdf' && pdf) {
        renderPdfPage(currentPage, prevCanvasRef.current, prevRenderTaskRef);
      } else if (prevCanvasRef.current && fileType === 'pptx' && pptx) {
        renderPptxSlide(currentPage - 1, prevCanvasRef.current);
      }

      setCurrentPage(pageNum);

      setTimeout(() => {
        if (prevRenderTaskRef.current) {
          prevRenderTaskRef.current.cancel();
          prevRenderTaskRef.current = null;
        }
        setTransitionDirection('none');
        setPrevPage(null);
      }, 300);
    }
  };

  const zoomIn = (): void => {
    setFitToWidth(false);
    setScale(prev => prev>=1?1:prev+0.2);
  };

  const zoomOut = (): void => {
    setFitToWidth(false);
    setScale(prev => prev<=0.3?0.2:prev-0.2);
  };

  const rotate = (): void => setRotation(prev => (prev + 90) % 360);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const pageNum = parseInt(e.target.value);
    if (!isNaN(pageNum)) {
      goToPage(pageNum);
    }
  };

  const handleRetry = (): void => {
    if (filePath) {
      setError(null);
      setLoading(true);
      setPdf(null);
      setPptx(null);
      setCurrentPage(1);
      setTotalPages(0);
      setFileType(null);
    }
  };
  useKeyboardNavigation(currentPage,totalPages,goToPage);
  if (IsFirstUse)
    return <Hide />;

  if (!filePath) {
    return (
      <NoFileContainer>
        <div>
          <FileText size={64} color="#cbd5e1" />
          <p>No file path provided</p>
        </div>
      </NoFileContainer>
    );
  }

  if (loading) 
    return <Loading filePath={filePath}/>

  if (error) {
    return (
      <ErrorContainer>
        <div>
          <ErrorIcon>
            <FileText size={32} color="#ef4444" />
          </ErrorIcon>
          <p>Unable to load file</p>
          <p>{error}</p>
          <p>{filePath}</p>
          <RetryButton onClick={handleRetry}>Try Again</RetryButton>
        </div>
      </ErrorContainer>
    );
  }

  return (
    <Container fullscreen={fullscreen} ref={containerRef} className={className}>
      <ContainerInner>
        <Header>
          <Controls>
            <ControlButton
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              title="Previous page"
            >
              <ChevronLeft size={20} />
            </ControlButton>
            <PageInputContainer>
              <PageInput
                type="number"
                value={currentPage}
                onChange={handlePageInputChange}
                min={1}
                max={totalPages}
              />
              <span>/</span>
              <span>{totalPages}</span>
            </PageInputContainer>
            <ControlButton
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              title="Next page"
            >
              <ChevronRight size={20} />
            </ControlButton>
          </Controls>
          <Controls>
            <ZoomControls>
              <ControlButton onClick={zoomOut} title="Zoom out">
                <ZoomOut size={18} />
              </ControlButton>
              <ScaleDisplay>
                {fitToWidth ? 'Fit' : `${Math.round(scale * 100)}%`}
              </ScaleDisplay>
              <ControlButton onClick={zoomIn} title="Zoom in">
                <ZoomIn size={18} />
              </ControlButton>
              <Divider />
            </ZoomControls>
            <ControlButton onClick={rotate} title="Rotate">
              <RotateCw size={18} />
            </ControlButton>
            <ControlButton onClick={() => setFullscreen(!fullscreen)} title="fullscreen">
              {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </ControlButton>
          </Controls>
        </Header>
        <PdfContainer ref={viewerRef}>
          <CanvasContainer>
            {prevPage !== null && (
              <CanvasWrapper
                $direction={transitionDirection}
                $isActive={false}
              >
                <Canvas ref={prevCanvasRef} />
              </CanvasWrapper>
            )}
            <CanvasWrapper
              $direction={transitionDirection}
              $isActive={true}
            >
              <Canvas ref={canvasRef} />
            </CanvasWrapper>
          </CanvasContainer>
        </PdfContainer>
        <Footer>
          <FilePath>
            <FileText size={12} />
            {filePath}
          </FilePath>
          <PageInfo>
            Page {currentPage} of {totalPages}
          </PageInfo>
        </Footer>
      </ContainerInner>
    </Container>
  );
};

export default PDFViewer;