/** Base URL for all network requests. Change this to match your backend address. */
export const addr: string = "http://localhost:3000";

export const getFileType = (path: string): 'pdf' | 'pptx' => {
  const ext = path.split('.').pop()?.toLowerCase();
  return (ext === 'ppt' || ext === 'pptx') ? 'pptx' : 'pdf';
};
