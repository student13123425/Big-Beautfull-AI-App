export const getFileType = (path: string): 'pdf' | 'pptx' => {
  const ext = path.split('.').pop()?.toLowerCase();
  return (ext === 'ppt' || ext === 'pptx') ? 'pptx' : 'pdf';
};