import React, { useEffect, useState } from 'react'
import { styled, keyframes } from 'styled-components'
import { Materie, Quiz, QuiZRequestItem, type FishierMaterie } from '../../scripts/objects'
import useKeyPress from '../../hooks/useKeyPress'
import { MdClose, MdCheckBox, MdCheckBoxOutlineBlank, MdRemove, MdAdd } from 'react-icons/md'
import { clone, isValidQuizItem } from '../../scripts/aox'
import { GenerateNewQuiz } from '../../scripts/network'
import AcknowledgeModal from '../Misc/AcknowledgeModal'
import { AlertTriangle } from 'lucide-react'

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(8px); }
`;

const scaleIn = keyframes`
  from { transform: scale(0.98); opacity: 0.9; }
  to { transform: scale(1); opacity: 1; }
`;

// Styled components
const Container = styled.div<{ $isClosing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  animation: ${props => props.$isClosing ? fadeOut : fadeIn} 0.3s ease forwards;
`;

const Header = styled.div`
  width: 100%;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  color: #fff;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 8px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.9);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  overflow: hidden;
  min-height: 0;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: ${scaleIn} 0.3s ease;
  overflow: hidden;
  height: 100%;
`;

const CardTitle = styled.h2`
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const OptionGroup = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
`;

const OptionLabel = styled.label`
  flex: 1;
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-left:15px;
`;

const CheckboxContainer = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  background: ${props => props.checked ? '#3b82f6' : '#fff'};
  border: 2px solid ${props => props.checked ? '#3b82f6' : '#cbd5e1'};
  border-radius: 5px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  svg {
    color: white;
    opacity: ${props => props.checked ? 1 : 0};
    transition: opacity 0.2s ease;
    font-size: 18px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
`;

const GenerateButton = styled.button`
  padding: 0.9rem 2.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NumberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #edf2f7;
  border-radius: 8px;
  padding: 0.3rem;
  height: 40px;
`;

const NumberButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4a5568;
  
  &:hover {
    background: #e2e8f0;
    border-color: #cbd5e1;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NumberText = styled.div`
  min-width: 40px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

const OptionText = styled.span`
  flex: 1;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  background: #fff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const TitleGroup = styled(OptionGroup)`
  padding: 0.8rem;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
`;

const GroupLabel = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  padding-left: 0.2rem;
`;

const FilesContainer = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

const FileItemContainer = styled.div<{ selected: boolean }>`
  width: 100%;
  background: white;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${props => props.selected ? '#3b82f6' : '#e2e8f0'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.selected ? '#2563eb' : '#cbd5e1'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const FileItemText = styled.div`
  font-size: 0.95rem;
  color: #334155;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 1rem;
`;

const FileSelectionLabel = styled.div`
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.5rem;
  padding-left: 0.3rem;
`;

const FileCount = styled.span`
  color: #3b82f6;
  font-weight: 600;
`;

export default function QuizCreatePage(props: {materie:Materie,QuizList:Quiz[], files: FishierMaterie[], onClose: Function ,setError:Function}) {
  const [isGrila, setIsGrila] = useState<boolean>(true);
  const [NrIntrebari, setNrIntrebari] = useState(5);
  const [IsControlDown, setIsControlDown] = useState<boolean>(false);
  const [Title, setTitle] = useState<string>('');
  const [SelectedFiles, setSelectedFiles] = useState<string[]>([])
  const [RequestItem, setRequestItem] = useState<QuiZRequestItem>(new QuiZRequestItem())
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [IsInvalidDataModal,setIsInvalidDataModal]=useState<boolean>(false);
  const max_intrebari = [1, 20];
  useEffect(() => {
    let it = new QuiZRequestItem(SelectedFiles, NrIntrebari, isGrila, Title,props.materie.name)
    setRequestItem(it)
  }, [isGrila, NrIntrebari, Title, SelectedFiles])
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      props.onClose();
    }, 250); // Match animation duration
  };
  
  useKeyPress('Escape', () => {
    if (!isClosing) handleClose();
  });
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'ControlLeft') {
        setIsControlDown(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'ControlLeft') {
        setIsControlDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const change_value = IsControlDown ? 5 : 1;
  
  const toggleFileSelection = (path: string) => {
    setSelectedFiles(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path) 
        : [...prev, path]
    );
  };

  const getFileName = (path: string) => {
    const segments = path.split("/");
    return segments.length > 0 ? segments[segments.length - 1] : path;
  };

  return (
    <Container $isClosing={isClosing}>
      {IsInvalidDataModal?<AcknowledgeModal iconColor='yellow' message="invalid data for quiz creation" title='Data Error' onClose={()=>setIsInvalidDataModal(false)} icon={<AlertTriangle size={40} color="#a8b100"/>}/>:<></>}
      <Header>
        <HeaderTitle>Create Quiz</HeaderTitle>
        <CloseButton onClick={handleClose}>
          <MdClose size={22} />
        </CloseButton>
      </Header>
      
      <ContentContainer>
        <ContentCard>
          <CardTitle>Quiz Options</CardTitle>
          
          <OptionsContainer>
            <TitleGroup>
              <GroupLabel>Quiz Title</GroupLabel>
              <TextInput 
                placeholder='Enter quiz title...' 
                onChange={(e) => setTitle(e.target.value)} 
                value={Title}
              />
            </TitleGroup>
            
            <OptionGroup>
              <CheckboxContainer>
                <HiddenCheckbox 
                  id="quiz-type"
                  checked={isGrila}
                  onChange={(e) => setIsGrila(e.target.checked)}
                />
                <StyledCheckbox checked={isGrila}>
                  {isGrila ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                </StyledCheckbox>
              </CheckboxContainer>
              <OptionLabel htmlFor="quiz-type">
                <OptionText>Multiple choice quiz (Grila)</OptionText>
              </OptionLabel>
            </OptionGroup>
            
            <OptionGroup>
              <NumberContainer>
                <NumberButton 
                  onClick={() => setNrIntrebari(Math.max(max_intrebari[0], NrIntrebari - change_value))}
                  disabled={NrIntrebari - change_value < max_intrebari[0]}
                >
                  <MdRemove />
                </NumberButton>
                <NumberText>{NrIntrebari}</NumberText>
                <NumberButton 
                  onClick={() => setNrIntrebari(Math.min(max_intrebari[1], NrIntrebari + change_value))}
                  disabled={NrIntrebari + change_value > max_intrebari[1]}
                >
                  <MdAdd />
                </NumberButton>
              </NumberContainer>
              <OptionLabel>
                <OptionText>Questions per File</OptionText>
                <GroupLabel style={{ fontSize: '0.85rem' }}>
                  {IsControlDown ? '(Ctrl: 5x increment)' : '(Hold Ctrl for larger steps)'}
                </GroupLabel>
              </OptionLabel>
            </OptionGroup>
          </OptionsContainer>
          
          <FilesContainer>
            <FileSelectionLabel>
              Select files: <FileCount>{SelectedFiles.length} of {props.files.filter(it=>it.sinteza!==null&&!it.is_computing).length} selected</FileCount>
            </FileSelectionLabel>
            
            {props.files.filter(it=>it.sinteza!==null&&!it.is_computing).map((file: FishierMaterie, i: number) => {
              const isSelected = SelectedFiles.includes(file.path);
              const fileName = getFileName(file.path);
              
              return (
                <FileItemContainer 
                  key={file.path} 
                  selected={isSelected}
                  onClick={() => toggleFileSelection(file.path)}
                >
                  <StyledCheckbox checked={isSelected}>
                    {isSelected ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                  </StyledCheckbox>
                  <FileItemText>{fileName}</FileItemText>
                </FileItemContainer>
              );
            })}
          </FilesContainer>
          
          <ButtonContainer>
            <GenerateButton onClick={()=>{
              if(isValidQuizItem(RequestItem,props.QuizList,props.files)){
               GenerateNewQuiz(RequestItem,props.setError) 
               handleClose()
              }
              else
                setIsInvalidDataModal(true);
            }}>
              Start Generation
            </GenerateButton>
          </ButtonContainer>
        </ContentCard>
      </ContentContainer>
    </Container>
  )
}