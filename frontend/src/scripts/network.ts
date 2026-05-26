import axios from "axios"
import { AiModel, compareStudyGroup, Config, Quiz, QuiZRequestItem, StudyGroup, StyleConfigList } from "./objects";

export const addr: string = "http://localhost:3000";

export async function DeactivateErrorMessage(
  index: number,
  setError: Function
): Promise<boolean> {
  try {
    const response = await axios.post(
      `${addr}/DeactivateErrorMessage`,
      { index },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'text', // Important for handling plain text responses
      }
    );

    const text = response.data.trim().toLowerCase();
    if (text === 'y') return true;
    if (text === 'n') return false;
    
    setError(`DeactivateErrorMessage: Unexpected response: "${text}"`);
    return false;
  } catch (error: any) {
    if (error.response) {
      // Server responded with a non-2xx status
      const status = error.response.status;
      let errorMsg = `Server error (${status}): `;
      
      if (typeof error.response.data === 'string') {
        errorMsg += error.response.data;
      } else if (error.response.data && typeof error.response.data.message === 'string') {
        errorMsg += error.response.data.message;
      } else {
        errorMsg += 'No additional error information';
      }
      
      setError(`DeactivateErrorMessage: ${errorMsg}`);
    } else if (error.request) {
      // Request was made but no response received
      setError('DeactivateErrorMessage: No response from server');
    } else {
      // Something happened in setting up the request
      setError(`DeactivateErrorMessage: Request setup error: ${error.message}`);
    }
    
    return false;
  }
}

export async function submiForEvaluation( quiz: Quiz,
  answers: string[],
  setError: Function
): Promise<boolean> {
  try {
    const response = await axios.post(`${addr}/Evaluare`, {
      quiz: {
        intrebari: quiz.intrebari,
        is_grila: quiz.is_grila,
        is_computing: quiz.is_computing,
        title: quiz.title,
        is_failed: false
      },
      raspunsuri: answers
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text' 
    });

    return response.data === "y";
  } catch (error: any) {
    if (error.response) {
      setError(`Server responded with status ${error.response.status}`);
    } else {
      setError("Evaluation submission failed:", error.message);
    }
    return false;
  }
}

export async function clear_evaluare(setError: Function): Promise<boolean> {
  try {
    const response = await axios.get(`${addr}/ClearEvaluare`, {
      responseType: 'text' // Important for handling plain text response
    });
    
    return response.data === 'y';
  } catch (error: any) {
    setError(`clear_evaluare failed to contact server ${error.message}`);
    return false;
  }
}

export async function get_config(
  setConfig: Function,
  setError: Function
) {
  try {
    const { data } = await axios.get<Partial<Config>>(`${addr}/config`);
    const config = new Config();

    // Use loadFrom to validate and load the data into the object
    if (config.loadFrom(data)) {
      setConfig(config);
    } else {
      // The data from the server didn't match the expected structure
      setError(
        "Failed to load configuration — the data received from the server was invalid."
      );
    }
  } catch (err: any) {
    // Server responded with an error status (4xx, 5xx)
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        "Unknown server error";
      setError(
        `Unable to load configuration — server responded with ${status}: ${serverMsg}.`
      );
    }
    // Network or other error (e.g., server is down)
    else if (err.request) {
      setError(
        `Network error — no response received when attempting to reach ${addr}/config.`
      );
    }
    // Something else went wrong setting up the request
    else {
      setError(`Unexpected error while fetching configuration: ${err.message}`);
    }
  }
}

export async function getSupportedModels(
  setModels: Function,
  setError: Function
): Promise<void> {
  console.error(`${addr}/select_model`);
  try {
    
    const { data } = await axios.get<string[]>(`${addr}/select_model`);
    setModels(data);
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        'Unknown server error';
      setError(
        `Unable to fetch supported models — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(`Network error — no response received when attempting to reach ${addr}/select_model.`);
    } else {
      setError(`Unexpected error while fetching supported models: ${err.message}`);
    }
  }
}



export async function selectModel(
  name: string,
  setError: Function
): Promise<void> {
  try {
    const { data } = await axios.post<string>(`${addr}/select_model`, { name });
    if (data === 'y') {
      return
    } else {
      setError(`Server rejected model selection: received "${data}".`);
    }
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        'Unknown server error';
      setError(
        `Unable to select model — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(`Network error — no response received when attempting to reach ${addr}/select_model.`);
    } else {
      setError(`Unexpected error while selecting model: ${err.message}`);
    }
  }
}

export async function setSystemPromptConfig(
  prompt: string,
  setError: Function
): Promise<void> {
  try {
    const { data } = await axios.post<string>(`${addr}/set_system_prompt`, { prompt });

    if (data === 'y') {
      return;
    }

    setError(`Server rejected system prompt: received "${data}".`);
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        'Unknown server error';
      setError(
        `Unable to set system prompt — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(`Network error — no response received when attempting to reach ${addr}/set_system_prompt.`);
    } else {
      setError(`Unexpected error while setting system prompt: ${err.message}`);
    }
  }
}

export async function setContextSizeConfig(
  size: number,
  setError: Function
): Promise<void> {
  try {
    const { data } = await axios.post<string>(`${addr}/set_context_size`, { size });

    if (data === 'y') {
      return;
    }

    if (data === 'name') {
      setError("Invalid context size: Missing parameter.");
    } else if (data === 'context') {
      setError("Invalid context size: Must be between 20,000 and 64,000 tokens.");
    } else {
      setError(`Server rejected context size: received "${data}".`);
    }
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        'Unknown server error';
      setError(
        `Unable to set context size — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(`Network error — no response received when attempting to reach ${addr}/set_context_size.`);
    } else {
      setError(`Unexpected error while setting context size: ${err.message}`);
    }
  }
}

export async function setLanguageConfig(
  lang: string,
  setError: Function
): Promise<void> {
  try {
    const { data } = await axios.post<string>(`${addr}/set_language`, { lang });

    if (data === 'y') {
      return;
    }

    setError(`Server rejected language selection: received "${data}".`);
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        'Unknown server error';
      setError(
        `Unable to select language — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(`Network error — no response received when attempting to reach ${addr}/set_language.`);
    } else {
      setError(`Unexpected error while selecting language: ${err.message}`);
    }
  }
}


export async function getCustomModels(
  setData: Function,
  setError:Function
) {
  try {
    const { data } = await axios.get<AiModel[]>(`${addr}/models_costum_format`);
    setData(data);
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      // Handle Axios-specific errors
      if (err.response) {
        const { status, data: responseData } = err.response;
        const serverMessage = 
          responseData?.message ||
          responseData?.error ||
          err.message ||
          'Unknown server error';
        setError(`Server error (${status}): ${serverMessage}`);
      } else if (err.request) {
        setError(`Network error: No response received from server`);
      } else {
        setError(`Request setup error: ${err.message}`);
      }
    } else {
      // Handle non-Axios errors
      setError(`Unexpected error: ${err?.message || 'Unknown error occurred'}`);
    }
  }
}

// update get_data to use functional setState
export async function get_data(
  setData: Function,
  setError: Function,
) {
  try {
    const { data } = await axios.get<StudyGroup>(`${addr}/study`);
    setData(data);
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        "Unknown server error";
      setError(
        `Unable to load data — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(
        `Network error — no response received when attempting to reach ${addr}/study.`
      );
    } else {
      setError(`Unexpected error while fetching configuration: ${err.message}`);
    }
  }
}


export async function getModelsPaths(
  setData: (paths: string[]) => void,
  setError: Function
) {
  try {
    const { data } = await axios.get<string[]>(`${addr}/models_paths`);
    setData(data);
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        "Unknown server error";
      setError(
        `Unable to load models — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(
        `Network error — no response received when attempting to reach ${addr}/models_paths.`
      );
    } else {
      setError(`Unexpected error while fetching models: ${err.message}`);
    }
  }
}

export async function getValidStudyLmstudio(
  setData: (out: string) => void,
  setError: (errorMsg: string) => void,
) {
  try {
    // The endpoint now returns a string, so we expect <string>.
    const { data: responseMessage } = await axios.get<string>(`${addr}/get_valid_study_lmstudio`);
    setData(responseMessage)
  } catch (err: any) {
    // This block handles network errors or non-2xx server responses.
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      // The server might send the error as plain text in the response body.
      const serverMsg = typeof respData === 'string' ? respData : (respData?.message || respData?.error || statusText || "Unknown server error");

      setError(
        `Unable to validate study — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      // The request was made but no response was received.
      setError(
        `Network error — no response received when attempting to reach ${addr}/get_valid_study_lmstudio.`
      );
    } else {
      // Something happened in setting up the request.
      setError(`Unexpected error while fetching validation: ${err.message}`);
    }
  }
}

export async function add_materie(
  setError: Function,
  name:string
): Promise<boolean> {

  try {
    const response = await axios.post<string>(
      `${addr}/add_materie`,
      {name:name},
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text',
      }
    );
    return response.data === 'y';
  } catch (error: any) {
    const message = error.response
      ? `Failed to send message (status ${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error while sending message: ${error.message}`;
    setError(message);
    return false;
  }
}

export async function stopAnsweringQuestion(
  setError: Function,
): Promise<boolean> {

  try {
    const { data } = await axios.get<StudyGroup>(`${addr}/stopAnsweringQuestion`);
    return true;
  } catch (error: any) {
    const message = error.response
      ? `Failed to stop generating (status ${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error while stoping question aswering: ${error.message}`;
    setError(message);
    return false;
  }
}

export async function AskDocumentQuestion(
  question: string,
  materie: string,
  file: string,
  quality:number,
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


export async function GenerateNewQuiz(
  data: QuiZRequestItem,
  setError: Function,
): Promise<boolean> {
  try {
    const response = await fetch(`${addr}/GenerateNewQuiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.text();
    if (result === "y") {
      return true;
    } else if (result === "n") {
      return false;
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    setError(`Failed to generate quiz: ${error.message}`);
    return false;
  }
}

export async function ReGenerateNewQuiz(
  data: QuiZRequestItem,
  setError:Function,
): Promise<boolean> {
  try {
    const response = await fetch(`${addr}/ReGenerateNewQuiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.text();
    if (result === "y") {
      return true; // Success
    } else if (result === "n") {
      setError("Failed to regenerate quiz. Please try again.");
      return false;
    } else {
      throw new Error(`Unexpected response: ${result}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    setError(`Failed to regenerate quiz: ${errorMessage}`);
    return false;
  }
}

export async function delete_materie(
  setError: Function,
  name:string
): Promise<boolean> {
  try {
    const response = await axios.post<string>(
      `${addr}/delete_materie`,
      {name:name},
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text',
      }
    );
    return response.data === 'y';
  } catch (error: any) {
    const message = error.response
      ? `Failed to send message (status ${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error while sending message: ${error.message}`;
    setError(message);
    return false;
  }
}

export async function delete_file(
  setError: Function,
  filename: string
): Promise<boolean> {
  try {
    const response = await axios.post<void>(
      `${addr}/delete_file`,
      { filename },
      {
        headers: { 'Content-Type': 'application/json' },
        // We expect no body on 204, so void
        validateStatus: (status) => status === 204,
      }
    );

    // If we get here, it's a 204
    return true;
  } catch (error: any) {
    // Axios will throw if status !== 204 or on network errors
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

import * as mammoth from 'mammoth';

export interface DocLoaderParams {
  serverUrl: string;
  filePath: string;
  abortSignal: AbortSignal;
}

export async function loadDocumentContent(input:DocLoaderParams): Promise<string> {
  const response = await fetch(`${input.serverUrl}/get_file`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: input.filePath }),
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
};

// networkUtils.ts
export const fetchFileFromServer = async (path: string, serverUrl: string = "http://localhost:3000"): Promise<Uint8Array> => {
  try {
    const response = await fetch(`${serverUrl}/get_file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
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

export const getFileType = (path: string): 'pdf' | 'pptx' => {
  const ext = path.split('.').pop()?.toLowerCase();
  return (ext === 'ppt' || ext === 'pptx') ? 'pptx' : 'pdf';
};

export async function DeleteQuiz(
  title: string,
  materie: string,
  setError: Function,
): Promise<boolean> {
  try {
    const response = await fetch(`${addr}/DeleteQuiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, materie }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.text();
    if (result === "y") {
      return true;
    } else if (result === "n") {
      return false;
    } else {
      throw new Error(`Unexpected response from server: "${result}"`);
    }
  } catch (error) {
    setError(`Failed to delete quiz: ${error.message}`);
    return false;
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
  setError: Function
): Promise<boolean> {
  try {
    const response = await axios.post(`${addr}/register`, {
      username,
      email,
      password,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.token) {
      return true;
    } else {
      setError("Registration failed: No token received");
      return false;
    }
  } catch (error: any) {
    const message = error.response
      ? `Server error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error during registration: ${error.message}`;
    setError(message);
    return false;
  }
}


export async function loginUser(
  identifier: string,
  password: string,
  setError: Function
): Promise<boolean> {
  try {
    const response = await axios.post(`${addr}/login`, {
      identifier,
      password,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.token) {
      return true;
    } else {
      setError("Login failed: No token received");
      return false;
    }
  } catch (error: any) {
    const message = error.response
      ? `Server error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error during login: ${error.message}`;
    setError(message);
    return false;
  }
}


export async function verifyToken(
  token: string,
  setError: Function
): Promise<boolean> {
  try {
    const response = await axios.post(`${addr}/verify_token`, {
      token,
    }, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text',
    });

    const data = response.data.trim();
    if (data === "null") {
      setError("Invalid or expired token");
      return false;
    } else if (!isNaN(Number(data))) {
      return true;
    } else {
      setError(`Unexpected verify_token response: "${data}"`);
      return false;
    }
  } catch (error: any) {
    const message = error.response
      ? `Server error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error during token verification: ${error.message}`;
    setError(message);
    return false;
  }
}

export async function generateHTML(
  name_materie: string,
  file_name: string,
  style_index: number | undefined,
  setError: Function
): Promise<boolean> {
  try {
    const response = await axios.post<string>(
      `${addr}/genereaza_html`,
      { name_materie, file_name, style_index },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data === "y") return true;
    if (response.data === "n") return false;
    setError(`generateHTML: Unexpected response "${response.data}"`);
    return false;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      let errorMsg = `Server error (${status}): `;
      if (typeof error.response.data === 'string') {
        errorMsg += error.response.data;
      } else if (error.response.data && typeof error.response.data.message === 'string') {
        errorMsg += error.response.data.message;
      } else {
        errorMsg += 'No additional error information';
      }
      setError(`generateHTML: ${errorMsg}`);
    } else if (error.request) {
      setError('generateHTML: No response from server');
    } else {
      setError(`generateHTML: Request setup error: ${error.message}`);
    }
    return false;
  }
}


export async function getAvailableStyles(
  setStyles: Function,
  setError: Function
): Promise<void> {
  try {
    const response = await axios.get<string>(`${addr}/sintezaStyles`);
    setStyles(new StyleConfigList(response.data));
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      let errorMsg = `Server error (${status}): `;
      if (typeof error.response.data === 'string') {
        errorMsg += error.response.data;
      } else if (error.response.data && typeof error.response.data.message === 'string') {
        errorMsg += error.response.data.message;
      } else {
        errorMsg += 'No additional error information';
      }
      setError(`getAvailableStyles: ${errorMsg}`);
    } else if (error.request) {
      setError('getAvailableStyles: No response from server');
    } else {
      setError(`getAvailableStyles: Request setup error: ${error.message}`);
    }
  }
}
