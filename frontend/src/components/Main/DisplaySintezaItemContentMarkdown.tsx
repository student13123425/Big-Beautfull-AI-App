import styled, { keyframes, css } from 'styled-components';
import { MdRefresh } from 'react-icons/md';
import { ImFileEmpty } from 'react-icons/im';
import MarkdownRenderer from '../Misc/MarkdownRenderer';
import type { FileD, FishierMaterie, Materie } from '../../scripts/objects';
import { extractMarkdown, get_output_content } from '../../scripts/aox';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface Props {
  file: FishierMaterie | null;
  Zoom: number;
  isFullScreen: boolean;
  isOpen: boolean;
  isGenerating: boolean;
  startSynthesisGeneration: () => void;
}

const ContentContainer = styled.div<{ $isOpen: boolean; $fullscreen?: boolean }>`
  overflow: ${props => props.$isOpen ? 'auto' : 'hidden'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  padding: ${props => props.$isOpen ? '24px' : '0'};
  background-color: #f8fafc;
  min-height: 0;
  ${({ $isOpen, $fullscreen }) => 
    $isOpen && $fullscreen ? css`flex: 1;` : css`flex: none;`}
  transition: 
    max-height 0.4s cubic-bezier(0.215, 0.610, 0.355, 1),
    opacity 0.3s ease,
    padding 0.4s cubic-bezier(0.215, 0.610, 0.355, 1);
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  &::-webkit-scrollbar { width: 0; height: 0; }
`;

const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 24px;
  text-align: center;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  margin-bottom: 16px;
  opacity: 0.7;
  svg { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05)); }
`;

const EmptyLabel = styled.div`
  font-size: 16px;
  font-weight: 400;
  max-width: 280px;
  line-height: 1.6;
  @media (max-width: 500px) { font-size: 14px; }
`;

const RefreshIcon = styled(MdRefresh)<{ $isRefreshing: boolean }>`
  transition: transform 0.3s ease;
  ${({ $isRefreshing }) => $isRefreshing && css`animation: ${rotate} 0.8s linear infinite;`}
`;

const GenerateButton = styled.button<{ $isGenerating: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-top: 20px;
  min-width: 180px;
  &:hover { background-color: #2563eb; }
  &:active { transform: scale(0.98); }
  &:disabled { background-color: #94a3b8; cursor: not-allowed; }
  @media (max-width: 500px) { padding: 8px 16px; font-size: 12px; min-width: 140px; }
`;

export default function DisplaySintezaItemContentMarkdown({file,Zoom,isFullScreen,isOpen,isGenerating,startSynthesisGeneration}: Props) {

  if (file === null) return null;

  return (
    <ContentContainer $isOpen={isOpen} $fullscreen={isFullScreen}>
      {file.sinteza === null || get_output_content(file.sinteza).length === 0 ? (
        <EmptyContent>
          <EmptyIcon><ImFileEmpty size={64} /></EmptyIcon>
          <EmptyLabel>Synthesis for this file hasn't been generated yet</EmptyLabel>
          <GenerateButton 
            onClick={() => startSynthesisGeneration()}
            $isGenerating={isGenerating}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshIcon size={18} $isRefreshing={true} /> Generating...
              </>
            ) : 'Generate Synthesis'}
          </GenerateButton>
        </EmptyContent>
      ) : (
        <MarkdownRenderer zoom={Zoom/100} content={extractMarkdown(get_output_content(file.sinteza))} />
      )}
    </ContentContainer>
  );
}
