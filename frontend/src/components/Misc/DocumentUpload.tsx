import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import useKeyPress from '../../hooks/useKeyPress';
import type { Materie } from '../../scripts/objects';
import { getUploadPageText, type UploadLanguage } from '../../lang/uploadLang';
import { addr } from '../../network/utils';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const UploadCard = styled.div`
    background: rgba(255, 255, 255, 0.98);
    border-radius: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 499px) {
        border-radius: 0;
        height: 100%;
    }
`;

const Header = styled.div`
    padding: 2rem 2rem 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e2e8f0;
`;

const Title = styled.h2`
    font-size: 1.75rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const Subtitle = styled.p`
    font-size: 0.95rem;
    color: #64748b;
    margin: 0;
`;

const DropZone = styled.div<{ $isDragOver: boolean }>`
    padding: ${props => props.$isDragOver ? '3rem' : '2.5rem'};
    text-align: center;
    border: 2px dashed ${props => props.$isDragOver ? '#3b82f6' : '#cbd5e1'};
    background: ${props => props.$isDragOver ? 'rgba(59, 130, 246, 0.05)' : '#f8fafc'};
    border-radius: 12px;
    margin: 2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.05);
    }

    @media (max-width: 499px) {
        margin: 1rem;
        padding: ${props => props.$isDragOver ? '2rem' : '1.5rem'};
    }
`;

const DropZoneIcon = styled.div`
    font-size: 3rem;
    margin-bottom: 1rem;
`;

const DropZoneTitle = styled.h3`
    font-size: 1.25rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0.5rem;
`;

const DropZoneText = styled.p`
    color: #64748b;
    font-size: 0.95rem;
`;

const OrDivider = styled.div`
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    color: #94a3b8;
    font-size: 0.9rem;

    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e2e8f0;
    }

    &::before {
        margin-right: 1rem;
    }

    &::after {
        margin-left: 1rem;
    }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger'; $isSmall?: boolean }>`
    padding: ${props => props.$isSmall ? '0.5rem 1rem' : '0.8rem 1.5rem'};
    border-radius: 8px;
    font-size: ${props => props.$isSmall ? '0.85rem' : '1rem'};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-family: 'Inter', sans-serif;

    ${props => {
        switch (props.variant) {
            case 'primary':
                return `
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
                    }
                `;
            case 'secondary':
                return `
                    background: #fff;
                    color: #3b82f6;
                    border: 1px solid #e2e8f0;
                    
                    &:hover {
                        background: rgba(59, 130, 246, 0.05);
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
        padding: ${props => props.$isSmall ? '0.4rem 0.8rem' : '0.6rem 1.2rem'};
        min-width: auto;
        width: 100%;
    }
`;

const FileList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
    
    @media (max-width: 499px) {
        max-height: 200px;
    }
`;

const FileItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    margin: 0.5rem 2rem;
    transition: all 0.2s ease;

    &:hover {
        background: #f1f5f9;
    }
`;

const FileName = styled.span`
    font-weight: 500;
    color: #334155;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
`;

const FileSize = styled.span`
    color: #64748b;
    font-size: 0.85rem;
    margin-left: 1rem;
`;

const ProgressBar = styled.div<{ $progress: number }>`
    width: ${props => props.$progress}%;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 2px;
    transition: width 0.3s ease;
`;

const UploadButton = styled.button`
    padding: 1rem 2rem;
    margin: 0 2rem 2rem;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    color: #64748b;
    transition: all 0.2s ease;

    &:hover {
        background: white;
        transform: scale(1.1);
    }
`;

const ErrorText = styled.p`
    color: #ef4444;
    font-size: 0.9rem;
    margin: 1rem 2rem 0;
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 8px;
    border-left: 4px solid #ef4444;
`;

const ReplaceModal = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ReplaceModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 16px;
    max-width: 400px;
    width: 90%;
    text-align: center;
`;

function getSupportedFileTypes(): string[] {
    return [
        'pdf', 'docx', 'xlsx', 'pptx', 
        'txt', 'md', 'csv', 'html', 'htm', 'tex', 'rtf'
    ];
}

interface DocumentUploadProps {
    materie: Materie;
    onClose: () => void;
    language?: string;
    userId?: string | null;
}

export default function DocumentUpload(props: DocumentUploadProps) {
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

    const langToUse = (props.language as UploadLanguage) || 'English';
    const texts = getUploadPageText(langToUse);

    // Use the exact materie name (preserve case) to ensure uploads go to the correct folder
    // and match the metadata in UserMetadata.json
    const basePath = props.materie.name;

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
        const filePaths = files.map(file => `${basePath}/${file.name}`);
        
        try {
            const response = await axios.post(`${addr}/check_existing`, {
                paths: filePaths,
                userId: props.userId || undefined
            });
            return response.data.existingFiles || [];
        } catch (err) {
            console.error('Error checking existing files:', err);
            return [];
        }
    };

    const uploadFile = async (file: File, onProgress: (progress: number) => void): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', basePath);
        if (props.userId) {
            formData.append('userId', props.userId);
        }
        
        try {
            console.log('[DocumentUpload] Uploading to:', `${addr}/send_file`, 'path:', basePath, 'file:', file.name);
            const response = await axios.post(`${addr}/send_file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total 
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total) 
                        : 0;
                    setUploadProgress(progress);
                    onProgress(progress);
                }
            });
            
            if (!response.data.success) {
                throw new Error(response.data.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Error uploading file:', err);
            throw err;
        }
    };

    const handleUpload = async () => {
        if (!validateFiles() || files.length === 0) return;

        setUploading(true);
        setUploadProgress(0);
        setError('');

        try {
            const existing = await checkForExistingFiles();
            
            if (existing.length > 0) {
                setShowReplaceModal(true);
                return;
            }

            let totalProgress = 0;
            for (let i = 0; i < files.length; i++) {
                await uploadFile(files[i], () => {
                    totalProgress = Math.round(((i + 1) / files.length) * 100);
                    setUploadProgress(totalProgress);
                });
            }

            props.onClose();
        } catch (err: any) {
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleReplace = async () => {
        setShowReplaceModal(false);
        setUploading(true);
        setUploadProgress(0);
        setError('');

        try {
            let totalProgress = 0;
            for (let i = 0; i < files.length; i++) {
                await uploadFile(files[i], () => {
                    totalProgress = Math.round(((i + 1) / files.length) * 100);
                    setUploadProgress(totalProgress);
                }, true);
            }

            props.onClose();
        } catch (err: any) {
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Container>
            {showReplaceModal && (
                <ReplaceModal>
                    <ReplaceModalContent>
                        <h3>Files already exist</h3>
                        <p>Do you want to replace the existing files?</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                            <Button variant="secondary" onClick={() => setShowReplaceModal(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleReplace}>Replace</Button>
                        </div>
                    </ReplaceModalContent>
                </ReplaceModal>
            )}

            <UploadCard>
                <Header>
                    <Title>
                        📄 {texts.uploadTitle}
                    </Title>
                    <Subtitle>{texts.uploadSubtitle}</Subtitle>
                </Header>

                <DropZone 
                    $isDragOver={isDragOver}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <DropZoneIcon>📁</DropZoneIcon>
                    <DropZoneTitle>{texts.dropZoneTitle}</DropZoneTitle>
                    <DropZoneText>
                        {isDragOver 
                            ? texts.dropZoneDragOver 
                            : texts.dropZoneDefault}
                    </DropZoneText>
                    
                    <OrDivider>{texts.orDivider}</OrDivider>
                    
                    <Button variant="secondary">
                        {texts.selectFilesButton}
                    </Button>
                    <DropZoneText style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                        {texts.supportedTypesLabel} {supportedTypes.join(', ')}
                    </DropZoneText>
                </DropZone>

                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept={`.${supportedTypes.join(', .')}`}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                />

                {error && <ErrorText>{error}</ErrorText>}

                {files.length > 0 && (
                    <>
                        <FileList>
                            {files.map((file, index) => (
                                <FileItem key={index}>
                                    <FileName title={file.name}>{file.name}</FileName>
                                    <FileSize>{formatFileSize(file.size)}</FileSize>
                                    {!uploading && (
                                        <Button 
                                            variant="danger" 
                                            $isSmall
                                            onClick={() => removeFile(index)}
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </FileItem>
                            ))}
                        </FileList>

                        {uploading && (
                            <div style={{ padding: '1rem 2rem' }}>
                                <ProgressBar $progress={uploadProgress} />
                                <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                    Uploading... {uploadProgress}%
                                </p>
                            </div>
                        )}

                        <UploadButton 
                            onClick={handleUpload}
                            disabled={uploading || files.length === 0}
                        >
                            {uploading ? '⏳ Uploading...' : `📤 ${texts.uploadButtonText}`}
                        </UploadButton>
                    </>
                )}

                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        variant="secondary" 
                        onClick={props.onClose}
                        disabled={uploading}
                    >
                        {texts.cancelButton}
                    </Button>
                </div>
            </UploadCard>
        </Container>
    );
}