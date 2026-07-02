import React, { useCallback, useLayoutEffect, useRef, useState, useMemo } from 'react'
import { styled } from 'styled-components'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { get_matery_list, type StudyGroup } from '../../scripts/objects'
import { capitalizeFirstLetter } from '../../scripts/aox'
import { add_materie, delete_materie } from '../../network/study-groups'
import InputModal from '../Misc/InputModal'
import ConfirmModal from '../Misc/ConfirmModal'
import { MdKeyboardArrowDown, MdSettings, MdClose } from 'react-icons/md'
import { useWindowResize } from '../../hooks/useWindowResize'
import useKeyRelease from '../../hooks/useKeyRelease'
import { getAddMaterieText, type AddMaterieLanguage } from '../../lang/modals/addMaterieText'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  padding: 0 1rem;
  gap: 0.75rem;
  overflow-x: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-bottom: 1px solid rgba(255,255,255,0.15);
  z-index: 100002;

  &::-webkit-scrollbar {
    display: none;
  }
`

const MeasurementContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  gap: 0.75rem;
  width: max-content;
  position: absolute;
  top: -9999px;
  left: -9999px;
  visibility: hidden;
  z-index: -1;
`;

const Item = styled.div<{ active?: boolean }>`
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
  padding: 0 1rem;
  background: ${({ active }) => active ? 'white' : 'rgba(255, 255, 255, 0.15)'};
  color: ${({ active }) => active ? '#1e40af' : 'rgba(255, 255, 255, 0.9)'};
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: fit-content;
  gap: 0.75rem;
  border-left: ${({ active }) => active ? '3px solid #3b82f6' : '3px solid transparent'};
  border: ${({ active }) => active ? '1px solid rgba(59, 130, 246, 0.5)' : 'none'};
  box-shadow: ${({ active }) => active ? '0 2px 8px rgba(59, 130, 246, 0.15)' : 'none'};

  &:hover {
    background: ${({ active }) => active ? 'white' : 'rgba(255, 255, 255, 0.2)'};
  }

  &:active {
    transform: scale(0.98);
  }
`

const DeleteButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$active ? '#fee2e2' : 'transparent'};
  border: ${props => props.$active ? '1px solid #fecaca' : 'none'};
  color: ${props => props.$active ? '#dc2626' : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 24px;
  min-height: 24px;

  &:hover {
    background: ${props => props.$active ? '#fecaca' : 'rgba(254, 215, 215, 0.3)'};
    color: ${props => props.$active ? '#b91c1c' : '#c53030'};
    transform: scale(1.1);
  }
`

const AddButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  background: #10b981;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);

  &:hover {
    background: #059669;
    transform: scale(1.05);
  }
`

const Hide = styled.div`
  display: none;
`

const Gap = styled.div`
  flex: 1;
`

const OverflowContainer = styled.div<{ isOpen: boolean }>`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  position: fixed;
  left: 0;
  top: 4rem; 
  width: 100vw;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  padding: 1rem;
  gap: 0.5rem;

  z-index: 10001;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-20px)')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};

  max-height: calc(100vh - 4rem);
  overflow-y: scroll;       
  
  scrollbar-width: none;       
  -ms-overflow-style: none;   

  &::-webkit-scrollbar {   
    width: 0;
    background: transparent;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 10000;
  
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  pointer-events: ${({ isOpen }) => isOpen ? 'auto' : 'none'};
`;

const IconWrapper = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

export default function TopBar(props: {
  data: StudyGroup,
  setSelected: Function,
  onError: Function,
  Selected: string | null,
  setIsSetings: Function,
  IsSetings: boolean,
  language?: string
}) {
  const [IsModal, setIsModal] = useState<boolean>(false)
  const [isOverflowing,setIsOverflowing] = useState(false);
  const [IsConfirm, setIsConfirm] = useState<string | null>(null);
  const [Open, setOpen] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);

  const list: string[] = useMemo(() => get_matery_list(props.data)
    .map((it) => capitalizeFirstLetter(it.toLowerCase()))
    .sort((i, j) => i.localeCompare(j)), [props.data]);

  const activeMaterie: string = useMemo(() => {
    if (!props.Selected) return '';
    return props.Selected;
  }, [props.Selected]);

  const checkOverflow = useCallback(() => {
    const containerNode = containerRef.current;
    const measurementNode = measurementRef.current;
    if (containerNode && measurementNode) {
      const totalContentWidth = measurementNode.scrollWidth;
      const availableWidth = containerNode.clientWidth;
      const isNowOverflowing = totalContentWidth > availableWidth + 1;
      setIsOverflowing(isNowOverflowing);
      if (!isNowOverflowing) {
        setOpen(false);
      }
    }
  }, []);

  useWindowResize(checkOverflow, { debounceMs: 50 });
  useKeyRelease("Escape",()=>setOpen(false))
  useLayoutEffect(() => {
    checkOverflow();
  }, [list, checkOverflow]);

  return (
    <>
      <MeasurementContainer ref={measurementRef}>
        <AddButton><MdSettings size={22} /></AddButton>
        {list.map((it, i) => (
          <Item key={i}>{it}<DeleteButton $active={false}><FaTrash size={12} /></DeleteButton></Item>
        ))}
        <Gap />
        <AddButton><FaPlus size={16} /></AddButton>
      </MeasurementContainer>

      {isOverflowing && (
        <>
          <Overlay isOpen={Open} onClick={() => setOpen(false)} />
          <OverflowContainer isOpen={Open}>
            {list.map((it, i) => {
              const isActive = Boolean(props.Selected) && it === props.Selected;
              return (
                <Item
                  key={`${i}-${activeMaterie}`}
                  active={isActive ? true : undefined}
                  onClick={() => {
                    props.setIsSetings(false);
                    props.setSelected(it);
                    setOpen(false);
                  }}
                >
                  {it}
                  <DeleteButton $active={isActive}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsConfirm(it);
                    }}
                    aria-label={`Șterge ${it}`}
                  >
                    <FaTrash size={12} />
                  </DeleteButton>
                </Item>
              )
            })}
          </OverflowContainer>
        </>
      )}

      <Container ref={containerRef}>
        {IsConfirm !== null && <ConfirmModal title='stergere materie' content={`Esti sigur că vrei să ștergi această materie și toate fișierele sale?`} onClose={(value: boolean) => {
          setIsConfirm(null);
          if (value) delete_materie(props.onError, IsConfirm);
        }} language={props.language} />}
        {IsModal && (() => {
          const lang = (props.language as AddMaterieLanguage) || 'Romanian';
          const modalTexts = getAddMaterieText(lang);
          return (
            <InputModal
              title={modalTexts.title}
              placeholder={modalTexts.placeholder}
              onClose={(out: string | null) => {
                setIsModal(false);
                if (out?.trim()) add_materie(props.onError, out.trim());
              }}
              content={modalTexts.content}
              cancelText={modalTexts.cancelText}
              submitText={modalTexts.submitText}
            />
          );
        })()}

        <AddButton onClick={() => props.setIsSetings(!props.IsSetings)}>
          {props.IsSetings ? <MdClose color="white" size={22} /> : <MdSettings color="white" size={22} />}
        </AddButton>

        {isOverflowing ? (
          <>
            <AddButton onClick={() => setOpen(!Open)} aria-label={Open ? "Închide meniul" : "Deschide meniul"}>
              <IconWrapper isOpen={Open}>
                <MdKeyboardArrowDown size={30} />
              </IconWrapper>
            </AddButton>
            <Gap />
          </>
        ) : (
          list.map((it, i) => {
            const isActive = Boolean(props.Selected) && it === props.Selected;
            return (
              <Item key={`${i}-${activeMaterie}`} active={isActive ? true : undefined} onClick={() => {
                props.setIsSetings(false);
                props.setSelected(it);
              }}>
                {it}
                <DeleteButton $active={isActive} onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirm(it);
                }} aria-label={`Șterge ${it}`}>
                  <FaTrash size={12} />
                </DeleteButton>
              </Item>
            )
          })
        )}

        <AddButton onClick={() => setIsModal(true)} aria-label="Adaugă materie nouă">
          <FaPlus size={16} />
        </AddButton>
      </Container>
    </>
  )
}