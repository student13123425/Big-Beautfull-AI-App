import axios from "axios";
import * as mammoth from 'mammoth';
import { addr } from "./utils";

export async function AskDocumentQuestion(
  question: string,
  materie: string,
  file: string,
  quality: number,
  setError: Function,
): Promise<boolean> {
  try {
    const response = await axios.post(
      `${addr}/askFileQuestion`,
      {
        question,
        materie: materie.toLowerCase(),
        file,
        quality
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'text'
      }
    );
    console.log(response.data);
    if (response.data === "y") {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    const message = error.response
      ? `Backend error (status ${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error AskDocumentQuestion: ${error.message}`;
    setError(message);
    return false;
  }
}

export async function stopAnsweringQuestion(
  setError: Function,
): Promise<boolean> {
  try {
    const { data } = await axios.get(`${addr}/stopAnsweringQuestion`);
    return true;
  } catch (error: any) {
    const message = error.response
      ? `Failed to stop generating (status ${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error while stoping question aswering: ${error.message}`;
    setError(message);
    return false;
  }
}

export async function delete_file(
  setError: Function,
  filename: string,
  userId?: string | null
): Promise<boolean> {
  try {
    const body: { filename: string; userId?: string } = { filename };
    if (userId) {
      body.userId = userId;
    }
    const response = await axios.post<void>(
      `${addr}/delete_file`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: (status) => status === 204,
      }
    );
    return true;
  } catch (error: any) {
    let message: string;
    if (error.response) {
      message = `Failed to delete file (status ${error.response.status}): ${error.response.data || error.response.statusText}`;
    } else {
      message = `Network error while deleting file: ${error.message}`;
    }
    setError(message);
    return false;
  }
}

export interface DocLoaderParams {
  serverUrl: string;
  filePath: string;
  abortSignal: AbortSignal;
  userId?: string;
}

export async function loadDocumentContent(input: DocLoaderParams): Promise<string> {
  const body: { path: string; userId?: string } = { path: input.filePath };
  if (input.userId) {
    body.userId = input.userId;
  }
  const response = await fetch(`${input.serverUrl}/get_file`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: input.abortSignal
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  const fileExtension = input.filePath.split('.').pop()?.toLowerCase() || '';

  if (fileExtension === 'docx') {
    const arrayBuffer = await response.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    if (result.messages.length > 0) {
      console.warn('Document conversion messages:', result.messages);
    }
    
    return result.value;
  } 

  if (fileExtension === 'txt' || fileExtension === 'md') {
    const text = await response.text();
    return `<pre style="white-space: pre-wrap; font-family: monospace;">${text}</pre>`;
  }

  throw new Error(`Unsupported file type: .${fileExtension}`);
}

export async function uploadImgGroup(
  files: File[],
  title: string,
  userId: string | null,
  setError: Function,
  serverUrl: string = addr
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('title', title);
    if (userId) {
      formData.append('userId', userId);
    }
    for (const file of files) {
      formData.append('files', file);
    }

    const response = await fetch(`${serverUrl}/upload_img_group`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to upload image group (status ${response.status}): ${errorData.message || response.statusText}`);
    }

    return true;
  } catch (error: any) {
    const message = error.response
      ? `Failed to upload image group (status ${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error while uploading image group: ${error.message}`;
    setError(message);
    return false;
  }
}

export const fetchFileFromServer = async (path: string, serverUrl: string = "http://localhost:3000", userId?: string | null): Promise<Uint8Array> => {
  try {
    const body: { path: string; userId?: string } = { path };
    if (userId) {
      body.userId = userId;
    }
    const response = await fetch(`${serverUrl}/get_file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (err) {
    console.error('Error fetching file from server:', err);
    throw err;
  }
};