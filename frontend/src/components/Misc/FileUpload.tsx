import React, { useState, useRef, useEffect } from 'react'
import type { Materie } from '../../scripts/objects'
import { keyframes, styled } from 'styled-components'
import axios from 'axios'
import { getSupportedFileTypes } from "../../scripts/aox"
import useKeyPress from '../../hooks/useKeyPress'

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { 
    transform: scale(0.98);
    opacity: 0.9;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
`;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    position: fixed;
    left: 0;
    top: 4rem;
    height: calc(100vh - 4rem);
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    display: flex;
    flex-direction: column;
    z-index: 9999;
    overflow: hidden;
    @media (max-width: 499px) {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
    }
`

const Header = styled.div`
    width: 100%;
    padding: 1.5rem 2rem;
    background: rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);

    @media (max-width: 499px) {
        padding: 1rem;
    }
`

const HeaderContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    animation: ${fadeIn} 0.3s ease;
`

const SubjectTitle = styled.h1`
    color: #fff;
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 499px) {
        font-size: 1.5rem;
        gap: 0.5rem;
    }
`

const SubjectIcon = styled.div`
    background: rgba(255, 255, 255, 0.15);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    backdrop-filter: blur(5px);

    @media (max-width: 499px) {
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
    }
`

const PathIndicator = styled.div`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 20px;
    display: inline-block;
    backdrop-filter: blur(5px);

    @media (max-width: 499px) {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
    }
`

const UploadCard = styled.div`
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: calc(100% - 3rem);
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    min-height: 0;
    overflow-y: auto;
    flex: 1;
    margin: 1.5rem;
    animation: ${scaleIn} 0.3s ease;
    
    &::-webkit-scrollbar {
        display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;

    @media (max-width: 499px) {
        margin: 0;
        width: 100%;
        padding: 1rem;
        border-radius: 0;
        box-shadow: none;
    }
`

const CardHeader = styled.div`
    margin-bottom: 2rem;
    text-align: center;

    @media (max-width: 499px) {
        margin-bottom: 1rem;
    }
`

const CardTitle = styled.h2`
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
    font-weight: 600;

    @media (max-width: 499px) {
        font-size: 1.5rem;
    }
`

const CardSubtitle = styled.p`
    color: #64748b;
    font-size: 1.1rem;
    margin: 0;

    @media (max-width: 499px) {
        font-size: 1rem;
    }
`

const DropZone = styled.div<{ isDragOver: boolean }>`
    border: 2px dashed ${props => props.isDragOver ? '#3b82f6' : '#cbd5e1'};
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    background: ${props => props.isDragOver ? 'rgba(59, 130, 246, 0.05)' : '#f8fafc'};
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    &:hover {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.03);
    }

    @media (max-width: 499px) {
        padding: 2rem 1rem;
        min-height: 200px;
    }
`

const DropZoneContent = styled.div`
    max-width: 500px;

    @media (max-width: 499px) {
        max-width: 100%;
    }
`

const DropZoneIcon = styled.div`
    font-size: 3.5rem;
    color: #3b82f6;
    margin-bottom: 1rem;

    @media (max-width: 499px) {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
`

const DropZoneTitle = styled.h3`
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    font-size: 1.4rem;

    @media (max-width: 499px) {
        font-size: 1.2rem;
    }
`

const DropZoneText = styled.p`
    color: #64748b;
    margin: 0.5rem 0;
    font-size: 1.1rem;
    line-height: 1.6;

    @media (max-width: 499px) {
        font-size: 1rem;
    }
`

const OrDivider = styled.div`
    position: relative;
    margin: 1.5rem 0;
    width: 80%;
    text-align: center;
    color: #94a3b8;
    
    &::before,
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 40%;
        height: 1px;
        background: #e2e8f0;
    }
    
    &::before {
        left: 0;
    }
    
    &::after {
        right: 0;
    }

    @media (max-width: 499px) {
        margin: 1rem 0;
    }
`

const FileList = styled.div`
    margin: 2rem 0;

    @media (max-width: 499px) {
        margin: 1rem 0;
    }
`

const FileListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    @media (max-width: 499px) {
        margin-bottom: 0.5rem;
    }
`

const FileListTitle = styled.h4`
    color: #1e293b;
    margin: 0;
    font-size: 1.2rem;

    @media (max-width: 499px) {
        font-size: 1rem;
    }
`

const FileListCount = styled.span`
    background: #3b82f6;
    color: white;
    border-radius: 12px;
    padding: 0.2rem 0.8rem;
    font-size: 0.9rem;

    @media (max-width: 499px) {
        font-size: 0.8rem;
        padding: 0.1rem 0.6rem;
    }
`

const FileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    overflow-y: auto;
    padding: 10px;
    background-color: #f1f5f9;
    border-radius: 8px;
    border: 1px solid #e2e8f0;

    @media (max-width: 499px) {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding: 5px;
    }
`

const FileItem = styled.div`
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    align-items: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 499px) {
        padding: 0.75rem;
    }
`

const FileIconContainer = styled.div`
    margin-right: 1rem;
    color: #3b82f6;
    font-size: 1.8rem;

    @media (max-width: 499px) {
        margin-right: 0.5rem;
        font-size: 1.5rem;
    }
`

const FileInfo = styled.div`
    flex: 1;
    min-width: 0;
`

const FileName = styled.div`
    font-weight: 500;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 499px) {
        font-size: 0.9rem;
    }
`

const FileSize = styled.div`
    color: #64748b;
    font-size: 0.9rem;

    @media (max-width: 499px) {
        font-size: 0.8rem;
    }
`

const RemoveButton = styled.button`
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background 0.2s ease;
    
    &:hover {
        background: rgba(239, 68, 68, 0.1);
    }

    @media (max-width: 499px) {
        font-size: 1rem;
        padding: 0.25rem;
    }
`

const ProgressSection = styled.div`
    margin: 2rem 0;
    background: #f8fafc;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;

    @media (max-width: 499px) {
        margin: 1rem 0;
        padding: 1rem;
    }
`

const ProgressHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;

    @media (max-width: 499px) {
        margin-bottom: 0.5rem;
    }
`

const ProgressTitle = styled.h4`
    color: #1e293b;
    margin: 0;
    font-size: 1.2rem;

    @media (max-width: 499px) {
        font-size: 1rem;
    }
`

const ProgressBar = styled.div<{ progress: number }>`
    height: 12px;
    background: #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 0.5rem;
    
    &::after {
        content: '';
        display: block;
        height: 100%;
        width: ${props => props.progress}%;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        border-radius: 6px;
        transition: width 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
    }
`

const ProgressText = styled.div`
    text-align: center;
    margin-top: 1rem;
    font-size: 1.1rem;
    color: #1e293b;
    font-weight: 500;
    
    span {
        color: #3b82f6;
    }

    @media (max-width: 499px) {
        font-size: 1rem;
        margin-top: 0.5rem;
    }
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;

    @media (max-width: 499px) {
        flex-direction: column-reverse;
        gap: 0.75rem;
        margin-top: 1rem;
    }
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
    padding: 0.8rem 1.8rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Inter', sans-serif;
    
    ${props => {
        switch (props.variant) {
            case 'primary':
                return `
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                    
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
                    }
                    
                    &:disabled {
                        background: #94a3b8;
                        box-shadow: none;
                        cursor: not-allowed;
                        transform: none;
                    }
                `;
            case 'danger':
                return `
                    background: #fff;
                    color: #ef4444;
                    border: 1px solid #e2e8f0;
                    
                    &:hover {
                        background: rgba(239, 68, 68, 0.05);
                    }
                `;
            default:
                return `
                    background: #fff;
                    color: #334155;
                    border: 1px solid #e2e8f0;
                    
                    &:hover {
                        background: #f8fafc;
                    }
                `;
        }
    }}

    @media (max-width: 499px) {
        padding: 0.7rem 1.2rem;
        font-size: 0.9rem;
        width: 100%;
        justify-content: center;
    }
`

const ErrorMessage = styled.div`
    color: #ef4444;
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(239, 68, 68, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    font-weight: 500;

    @media (max-width: 499px) {
        margin: 0.5rem 0;
        padding: 0.75rem;
        font-size: 0.9rem;
    }
`

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(4px);
`

const ModalContent = styled.div`
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 600px;
    padding: 2.5rem;
    position: relative;
    animation: ${scaleIn} 0.3s ease;

    @media (max-width: 499px) {
        max-width: none;
        height: 100%;
        border-radius: 0;
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }
`

const ModalHeader = styled.div`
    margin-bottom: 1.5rem;
    text-align: center;

    @media (max-width: 499px) {
        margin-bottom: 1rem;
    }
`

const ModalTitle = styled.h2`
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;

    @media (max-width: 499px) {
        font-size: 1.5rem;
    }
`

const ModalText = styled.p`
    color: #64748b;
    font-size: 1.1rem;
    margin: 0;
    text-align: center;
    line-height: 1.6;

    @media (max-width: 499px) {
        font-size: 1rem;
    }
`

const ExistingFilesList = styled.div`
    max-height: 250px;
    overflow-y: auto;
    margin: 1.5rem 0;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;

    @media (max-width: 499px) {
        flex: 1;
        max-height: none;
        margin: 1rem 0;
        padding: 0.75rem;
    }
`

const ExistingFileItem = styled.div`
    padding: 0.8rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    
    &:last-child {
        border-bottom: none;
    }

    @media (max-width: 499px) {
        padding: 0.5rem;
        gap: 0.5rem;
    }
`

const ExistingFileName = styled.div`
    flex: 1;
    font-weight: 500;
    color: #1e293b;

    @media (max-width: 499px) {
        font-size: 0.9rem;
    }
`

const ModalButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1.5rem;

    @media (max-width: 499px) {
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }
`

const ModalButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
    padding: 0.9rem 2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
    min-width: 140px;
    font-family: 'Inter', sans-serif;
    
    ${props => {
        switch (props.variant) {
            case 'primary':
                return `
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                    
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
                    }
                `;
            case 'danger':
                return `
                    background: #fff;
                    color: #ef4444;
                    border: 1px solid #e2e8f0;
                    
                    &:hover {
                        background: rgba(239, 68, 68, 0.05);
                    }
                `;
            default:
                return `
                    background: #fff;
                    color: #334155;
                    border: 1px solid #e2e8f0;
                    
                    &:hover {
                        background: #f8fafc;
                    }
                `;
        }
    }}

    @media (max-width: 499px) {
        padding: 0.8rem 1.5rem;
        min-width: auto;
        width: 100%;
    }
`

interface FileUploadProps {
    materie: Materie;
    onClose: () => void;
}

export default function FileUpload(props: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [supportedTypes, setSupportedTypes] = useState<string[]>([]);
    const [existingFiles, setExistingFiles] = useState<string[]>([]);
    const [showReplaceModal, setShowReplaceModal] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    
    const path: string = `./data/${props.materie.name.toLowerCase()}`;
    const subjectInitial = props.materie.name.charAt(0).toUpperCase();
    
    useKeyPress('Escape', () => {
        props.onClose()
    });
    
    useEffect(() => {
        const checkScreen = () => {
            setIsSmallScreen(window.innerWidth < 500);
        };

        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);
    
    useEffect(() => {
        setSupportedTypes(getSupportedFileTypes());
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
        setError('');
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...selectedFiles]);
            setError('');
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setError('');
    };

    const validateFiles = (): boolean => {
        const invalidFiles: string[] = [];
        
        files.forEach(file => {
            const fileExtension = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase();
            const isValid = supportedTypes.some(ext => 
                `${fileExtension}` === ext.toLowerCase()
            );
            
            if (!isValid) {
                invalidFiles.push(file.name);
            }
        });
        if (invalidFiles.length > 0) {
            setError(
                `Unsupported file type(s): ${invalidFiles.join(', ')}. ` +
                `Supported types: ${supportedTypes.join(', ')}`
            );
            return false;
        }
        
        return true;
    };

    const checkForExistingFiles = async (): Promise<string[]> => {
        const filePaths = files.map(file => `${path}/${file.name}`);
        
        try {
            const response = await axios.post('http://localhost:3000/check_existing', {
                paths: filePaths
            });
            return response.data.existingFiles || [];
        } catch (err) {
            console.error('Error checking existing files:', err);
            return [];
        }
    };

    const uploadFiles = async () => {
        if (files.length === 0) return;
        
        if (!validateFiles()) {
            return;
        }

        setUploading(true);
        setError('');
        
        const existing = await checkForExistingFiles();
        
        if (existing.length > 0) {
            setExistingFiles(existing.map(filePath => filePath.substring(filePath.lastIndexOf('/') + 1)));
            setShowReplaceModal(true);
            setUploading(false);
            return;
        }
        
        performUpload();
    };

    const performUpload = async () => {
        setShowReplaceModal(false);
        setUploading(true);
        setUploadProgress(0);
        setError('');

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('path', `${path}/${file.name}`);

                await axios.post('http://localhost:3000/send_file', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const fileProgress = (progressEvent.loaded / progressEvent.total) * 100;
                            const totalProgress = ((i * 100) + fileProgress) / files.length;
                            setUploadProgress(Math.round(totalProgress));
                        }
                    },
                });
            }

            setUploadProgress(100);
            setTimeout(() => {
                setFiles([]);
                setUploading(false);
                setUploadProgress(0);
                if (props.onClose) props.onClose();
            }, 1000);

        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload files. Please try again.');
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const clearFiles = () => {
        setFiles([]);
        setError('');
    };

    const handleReplaceConfirm = () => {
        performUpload();
    };

    const handleReplaceCancel = () => {
        setShowReplaceModal(false);
        setUploading(false);
        setExistingFiles([]);
    };

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <SubjectTitle>
                        <SubjectIcon>{subjectInitial}</SubjectIcon>
                        {props.materie.name}
                    </SubjectTitle>
                    <PathIndicator>Upload path: {path}</PathIndicator>
                </HeaderContent>
            </Header>
            
            <UploadCard>
                <CardHeader>
                    <CardTitle>Upload Files</CardTitle>
                    <CardSubtitle>Add files to your subject repository</CardSubtitle>
                </CardHeader>
                
                <DropZone
                    isDragOver={isDragOver}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <DropZoneContent>
                        <DropZoneIcon>📁</DropZoneIcon>
                        <DropZoneTitle>Add your files</DropZoneTitle>
                        <DropZoneText>
                            {isDragOver 
                                ? "Drop your files here" 
                                : "Drag and drop files here or click to browse"}
                        </DropZoneText>
                        
                        <OrDivider>or</OrDivider>
                        
                        <Button variant="secondary">
                            Select Files
                        </Button>
                        <DropZoneText style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            Supported types: {supportedTypes.join(', ')}
                        </DropZoneText>
                    </DropZoneContent>
                </DropZone>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept={supportedTypes.map(type => `.${type}`).join(',')}
                />

                {files.length > 0 && (
                    <FileList>
                        <FileListHeader>
                            <FileListTitle>Selected Files</FileListTitle>
                            <FileListCount>{files.length} files</FileListCount>
                        </FileListHeader>
                        
                        <FileGrid>
                            {files.map((file, index) => {
                                const fileExtension = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase();
                                const isValid = supportedTypes.some(ext => 
                                    `${fileExtension}` === ext.toLowerCase()
                                );
                                
                                return (
                                    <FileItem key={index}>
                                        <FileIconContainer>
                                            {isValid ? '📄' : '⚠️'}
                                        </FileIconContainer>
                                        <FileInfo>
                                            <FileName>{file.name}</FileName>
                                            <FileSize>
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                {!isValid && (
                                                    <span style={{ color: '#ef4444', marginLeft: '8px' }}>
                                                        (Unsupported)
                                                    </span>
                                                )}
                                            </FileSize>
                                        </FileInfo>
                                        <RemoveButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(index);
                                            }}
                                            disabled={uploading}
                                            title="Remove file"
                                        >
                                            ×
                                        </RemoveButton>
                                    </FileItem>
                                );
                            })}
                        </FileGrid>
                    </FileList>
                )}

                {(uploading || uploadProgress > 0) && (
                    <ProgressSection>
                        <ProgressHeader>
                            <ProgressTitle>Upload Progress</ProgressTitle>
                            <div>{uploadProgress}%</div>
                        </ProgressHeader>
                        <ProgressBar progress={uploadProgress} />
                        <ProgressText>
                            {uploadProgress === 100 
                                ? "🎉 Upload completed successfully!" 
                                : <span>⏳ Uploading {files.length} file{files.length !== 1 ? 's' : ''}...</span>
                            }
                        </ProgressText>
                    </ProgressSection>
                )}

                {error && (
                    <ErrorMessage style={{ whiteSpace: 'pre-wrap' }}>
                        ⚠️ {error}
                    </ErrorMessage>
                )}

                <ButtonContainer>
                    <Button 
                        variant="secondary" 
                        onClick={props.onClose} 
                        disabled={uploading}
                    >
                        Close
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={clearFiles} 
                        disabled={files.length === 0 || uploading}
                    >
                        Clear All
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={uploadFiles}
                        disabled={files.length === 0 || uploading}
                    >
                        {uploading ? (
                            <>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <span>Upload</span>
                                <span>({files.length})</span>
                            </>
                        )}
                    </Button>
                </ButtonContainer>
            </UploadCard>

            {showReplaceModal && (
                <ModalOverlay onClick={isSmallScreen ? undefined : handleReplaceCancel}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Replace Existing Files?</ModalTitle>
                            <ModalText>
                                The following files already exist. Do you want to replace them?
                            </ModalText>
                        </ModalHeader>
                        
                        <ExistingFilesList>
                            {existingFiles.map((fileName, index) => (
                                <ExistingFileItem key={index}>
                                    <div>📄</div>
                                    <ExistingFileName>{fileName}</ExistingFileName>
                                </ExistingFileItem>
                            ))}
                        </ExistingFilesList>
                        
                        <ModalText style={{ color: '#ef4444', fontWeight: 500 }}>
                            Warning: Replacing files cannot be undone
                        </ModalText>
                        
                        <ModalButtonContainer>
                            <ModalButton 
                                variant="secondary" 
                                onClick={handleReplaceCancel}
                            >
                                Cancel
                            </ModalButton>
                            <ModalButton 
                                variant="primary" 
                                onClick={handleReplaceConfirm}
                            >
                                Replace Files
                            </ModalButton>
                        </ModalButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}