import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { 
  FaTrash, 
  FaFile, 
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint 
} from 'react-icons/fa';
import { 
  MdFormatListNumbered, 
  MdTextFields 
} from 'react-icons/md';
import { FcImageFile } from 'react-icons/fc';
import type { Quiz, FileD, FishierMaterie } from '../../scripts/objects';
import { delete_file, DeleteQuiz } from '../../scripts/network';
import ConfirmModal from './ConfirmModal';

const computingPulse = keyframes`
  0% { background-color: #fff6; }
  50% { background-color: #f0f9ff; }
  100% { background-color: #fff6; }
`;

const Container = styled.div<{ 
  $isOpen: boolean, 
  $active: boolean,
  $isComputing: boolean 
}>`
  display: flex;
  gap: ${props => props.$isOpen ? '12px' : '0'};
  padding: ${props => props.$isOpen ? '12px' : '8px'};
  background-color: #fff6;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  cursor: ${props => props.$isComputing ? 'wait' : 'pointer'};
  overflow: hidden;
  width: 100%;
  height: 3.6rem;
  min-height: 3.6rem;
  animation: ${props => 
    props.$isComputing 
      ? css`${computingPulse} 1.5s ease infinite` 
      : 'none'};

  &:hover {
    background-color: ${props => 
      props.$isComputing ? '#f0f9ff' : '#fff9'};
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  }

  * {
    user-select: none;
  }
`;

const FileIcon = styled.div<{ $active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 8px;
  background-color: #fffe;
  flex-shrink: 0;
  transition: all 0.2s ease;
`;

const FileInfo = styled.div<{ $isOpen: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  opacity: ${props => props.$isOpen ? 1 : 0};
  width: ${props => props.$isOpen ? 'auto' : '0'};
  transition: all 0.3s ease;
`;

const FileName = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const FileType = styled.span`
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const DeleteButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  width: ${props => props.$isOpen ? '36px' : '0'};
  border-radius: 5px;
  background: #ef4444;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  overflow: hidden;
  flex-shrink: 0;
  user-select: none;

  &:hover {
    background-color: #dc2626;
  }

  &:active {
    background-color: #b91c1c;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #f8fafc;
    > * {
      color: #cbd5e1;
    }
  }
`;

const iconConfig: Record<string, React.ReactNode> = {
  pdf: <FaFilePdf size={18} color="#ef4444" />,
  docx: <FaFileWord size={18} color="#2563eb" />,
  doc: <FaFileWord size={18} color="#2563eb" />,
  pptx: <FaFilePowerpoint size={18} color="#f97316" />,
  ppt: <FaFilePowerpoint size={18} color="#f97316" />,
  jpeg: <FcImageFile size={18} />,
  jpg: <FcImageFile size={18} />,
  png: <FcImageFile size={18} />,
};

type BrowserItemType = 'quiz' | 'file';

interface BrowserItemProps {
  type: BrowserItemType;
  item: Quiz | FileD;
  onDelete?: () => void;
  isOpen: boolean;
  setItem: Function;
  setError: Function;
  selectedItem: Quiz | FileD | null;
  materie_name?: string;
  list: FishierMaterie[] | null;
}

const BrowserItem: React.FC<BrowserItemProps> = ({ 
  type,
  item,
  onDelete,
  isOpen,
  setItem,
  setError,
  selectedItem,
  materie_name,
  list
}) => {
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (type === 'quiz') {
      const quiz = item as Quiz;
      setIsComputing(quiz.is_computing || false);
    } else if (list) {
      const buf: FishierMaterie | undefined = list.find((it) => it.path.includes((item as FileD).nume));
      if (buf) {
        setIsComputing(buf.is_computing);
      }
    }
  }, [item, type, list]);

  let icon: React.ReactNode;
  let name: string;
  let extension: string | null = null;
  let isActive = false;

  if (type === 'quiz') {
    const quiz = item as Quiz;
    icon = quiz.is_grila ? 
      <MdFormatListNumbered color="#1E88E5" size={22} /> : 
      <MdTextFields size={22} color="#1E88E5" />;
    name = quiz.title.toUpperCase();
    isActive = selectedItem !== null && 
      'title' in selectedItem && 
      selectedItem.title === quiz.title;
  } else {
    const file = item as FileD;
    const fileExt = file.tip.toLowerCase();
    icon = iconConfig[fileExt] || <FaFile size={18} color="#64748b" />;
    const nameSegments = file.nume.split("/");
    name = nameSegments.length === 0 ? file.nume : nameSegments[nameSegments.length - 1];
    extension = fileExt;
    isActive = selectedItem !== null && 
      'nume' in selectedItem && 
      selectedItem.nume === file.nume;
  }

  const handleClick = () => {
    if (isComputing && type === "quiz") return;
    setItem(isActive ? null : item);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isComputing) setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (type === 'quiz') {
      const quiz = item as Quiz;
      DeleteQuiz(quiz.title, materie_name || '', setError);
    } else {
      const file = item as FileD;
      delete_file(setError, file.nume);
    }
    if (onDelete) onDelete();
    if (isActive) setItem(null);
  };

  return (
    <>
      <Container 
        $isOpen={isOpen} 
        $active={isActive}
        $isComputing={isComputing}
        onClick={handleClick}
      >
        <FileIcon $active={isActive}>
          {icon}
        </FileIcon>
        <FileInfo $isOpen={isOpen}>
          <FileName title={name}>
            {name}
            {isComputing && " (Generating...)"}
          </FileName>
          {type === 'file' && <FileType>.{extension}</FileType>}
        </FileInfo>
        <DeleteButton 
          $isOpen={isOpen}
          disabled={isComputing}
          onClick={handleDelete}
          aria-label={`Delete ${type}`}
        >
          <FaTrash size={14} color="#ffffff" />
        </DeleteButton>
      </Container>
      {isModalOpen && (
        <ConfirmModal 
          title={`Delete ${type === 'quiz' ? 'Quiz' : 'File'}`}
          content={`Are you sure you want to delete ${name}?`}
          onClose={(confirmed) => {
            setIsModalOpen(false);
            if (confirmed) confirmDelete();
          }}
        />
      )}
    </>
  );
};

export default BrowserItem;