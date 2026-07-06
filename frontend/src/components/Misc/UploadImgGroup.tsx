import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import type { Materie } from '../../scripts/objects';
import { Image, ImageGroup } from '../../scripts/objects';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'];

interface UploadImgGroupProps {
  materie: Materie;
  onClose: () => void;
  language?: string;
}

interface ImageItem {
  file: File;
  preview: string;
  title: string;
}

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

const InputGroup = styled.div`
    margin-top: 1.5rem;
`;

const Label = styled.label`
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.5rem;
`;

const TitleInput = styled.input`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
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

const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    padding: 1.5rem 2rem;
    overflow-y: auto;
    max-height: 400px;

    @media (max-width: 499px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 0.75rem;
        padding: 1rem;
    }
`;

const ImageCard = styled.div<{ $isDragging?: boolean; $isOver?: boolean }>`
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid ${props => props.$isOver ? '#3b82f6' : '#e2e8f0'};
    background: ${props => props.$isOver ? 'rgba(59, 130, 246, 0.05)' : '#f8fafc'};
    transition: all 0.2s ease;
    cursor: grab;

    opacity: ${props => props.$isDragging ? 0.5 : 1};
    transform: ${props => props.$isDragging ? 'scale(0.95)' : 'none'};

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &[draggable="true"] {
        user-select: none;
    }
`;

const DragHandle = styled.div`
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: grab;
    z-index: 10;
    backdrop-filter: blur(5px);

    &:hover {
        background: rgba(0, 0, 0, 0.8);
    }
`;

const ImagePreview = styled.img`
    width: 100%;
    height: 150px;
    object-fit: cover;
    pointer-events: none;
`;

const ImageActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: white;
    border-top: 1px solid #e2e8f0;
`;

const ImageTitleInput = styled.input`
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    color: #334155;
    padding: 0.25rem 0.5rem;
    border-bottom-left-radius: 12px;

    &:focus {
        outline: none;
        background: rgba(59, 130, 246, 0.05);
    }
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(239, 68, 68, 0.1);
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 2rem;
    color: #94a3b8;

    p {
        font-size: 1rem;
        margin-top: 1rem;
    }
`;

const Footer = styled.div`
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
`;

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isImageValid = (file: File): boolean => {
    const extension = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase();
    return IMAGE_EXTENSIONS.includes(extension);
};

const UploadImgGroup: React.FC<UploadImgGroupProps> = ({ materie, onClose }) => {
    const [imageGroup, setImageGroup] = useState<ImageGroup>(new ImageGroup(''));
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const getPreviewForFile = useCallback((file: File) => {
        return URL.createObjectURL(file);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files).filter(isImageValid);
        addFiles(droppedFiles);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).filter(isImageValid);
            addFiles(selectedFiles);
        }
    };

    const addFiles = (files: File[]) => {
        setImageGroup(prev => {
            const newImages = [...prev.images];
            
            files.forEach(file => {
                const preview = getPreviewForFile(file);
                const imageItem: ImageItem = { file, preview, title: file.name };
                const image = new Image(preview, file.name);
                newImages.push(image);
            });

            const updatedGroup = new ImageGroup(prev.title, newImages);
            return updatedGroup;
        });
    };

    const removeImage = (index: number) => {
        setImageGroup(prev => {
            const removed = prev.removeImageAt(index);
            if (removed) {
                URL.revokeObjectURL(removed.path);
            }
            return new ImageGroup(prev.title, [...prev.images]);
        });
    };

    const updateTitle = (title: string) => {
        setImageGroup(prev => new ImageGroup(title, [...prev.images]));
    };

    const updateImageTitle = (index: number, title: string) => {
        setImageGroup(prev => {
            const images = [...prev.images];
            if (images[index]) {
                images[index] = new Image(images[index].path, title);
            }
            return new ImageGroup(prev.title, images);
        });
    };

    const handleCardDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleCardDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
            setOverIndex(index);
        }
    };

    const handleCardDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        
        if (draggedIndex === null || draggedIndex === targetIndex) return;
        
        setImageGroup(prev => {
            const images = [...prev.images];
            const draggedItem = images[draggedIndex];
            images.splice(draggedIndex, 1);
            images.splice(targetIndex, 0, draggedItem);
            return new ImageGroup(prev.title, images);
        });
        
        setDraggedIndex(null);
        setOverIndex(null);
    };

    const handleCardDragEnd = () => {
        setDraggedIndex(null);
        setOverIndex(null);
    };

    const handleUpload = async () => {
    };

    const handleClose = () => {
        imageGroup.images.forEach(img => {
            if (img.path.startsWith('blob:')) {
                URL.revokeObjectURL(img.path);
            }
        });
        setImageGroup(new ImageGroup(''));
        onClose();
    };

    const images = imageGroup.images;

    return (
        <Container>
            <UploadCard>
                <Header>
                    <Title>🖼️ Image Group</Title>
                    <Subtitle>Upload and organize images for your image group</Subtitle>
                    
                    <InputGroup>
                        <Label htmlFor="group-title">Group Title</Label>
                        <TitleInput
                            id="group-title"
                            type="text"
                            value={imageGroup.title}
                            onChange={(e) => updateTitle(e.target.value)}
                            placeholder="Enter image group title..."
                        />
                    </InputGroup>
                </Header>

                <DropZone 
                    $isDragOver={isDragOver}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <DropZoneIcon>🖼️</DropZoneIcon>
                    <DropZoneTitle>Drop images here</DropZoneTitle>
                    <DropZoneText>
                        or click to select image files
                    </DropZoneText>
                    
                    <OrDivider>JPG, PNG, GIF, WEBP, SVG, TIFF</OrDivider>
                    
                    <Button variant="secondary">
                        Select Images
                    </Button>
                </DropZone>

                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept={`.${IMAGE_EXTENSIONS.join(', .')}`}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                />

                {images.length === 0 ? (
                    <EmptyState>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                        <p>No images uploaded yet. Add some images to get started.</p>
                    </EmptyState>
                ) : (
                    <>
                        <ImageGrid>
                            {images.map((image, index) => (
                                <ImageCard 
                                    key={index}
                                    $isDragging={draggedIndex === index}
                                    $isOver={overIndex === index && draggedIndex !== index}
                                    draggable
                                    onDragStart={() => handleCardDragStart(index)}
                                    onDragOver={(e) => handleCardDragOver(e, index)}
                                    onDrop={(e) => handleCardDrop(e, index)}
                                    onDragEnd={handleCardDragEnd}
                                >
                                    <DragHandle>⠿</DragHandle>
                                    <ImagePreview src={image.path} alt={image.text} />
                                    <ImageActions>
                                        <ImageTitleInput
                                            type="text"
                                            value={image.text}
                                            onChange={(e) => updateImageTitle(index, e.target.value)}
                                            placeholder="Image title..."
                                        />
                                        <RemoveButton
                                            onClick={() => removeImage(index)}
                                            title="Remove"
                                        >
                                            🗑️
                                        </RemoveButton>
                                    </ImageActions>
                                </ImageCard>
                            ))}
                        </ImageGrid>

                        <Footer>
                            <span style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                {images.length} image{images.length !== 1 ? 's' : ''}
                            </span>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Footer>

                        <div style={{ padding: '0 2rem 1rem' }}>
                            <Button 
                                variant="primary" 
                                onClick={handleUpload}
                                disabled={images.length === 0}
                                style={{ width: '100%' }}
                            >
                                📤 Upload Image Group
                            </Button>
                        </div>
                    </>
                )}
            </UploadCard>
        </Container>
    );
};

export default UploadImgGroup;