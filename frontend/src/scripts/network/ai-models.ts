import axios from "axios";

export async function getSupportedModels(
  setModels: Function,
  setError: Function
): Promise<void> {
  try {
    const { data } = await axios.get<string[]>(`http://localhost:3000/select_model`);
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
      setError(`Network error — no response received when attempting to reach http://localhost:3000/select_model.`);
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
    const { data } = await axios.post<string>(`http://localhost:3000/select_model`, { name });
    if (data === 'y') {
      return;
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
      setError(`Network error — no response received when attempting to reach http://localhost:3000/select_model.`);
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
    const { data } = await axios.post<string>(`http://localhost:3000/set_system_prompt`, { prompt });

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
      setError(`Network error — no response received when attempting to reach http://localhost:3000/set_system_prompt.`);
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
    const { data } = await axios.post<string>(`http://localhost:3000/set_context_size`, { size });

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
      setError(`Network error — no response received when attempting to reach http://localhost:3000/set_context_size.`);
    } else {
      setError(`Unexpected error while setting context size: ${err.message}`);
    }
  }
}

export async function getCustomModels(
  setData: Function,
  setError: Function
) {
  try {
    const { data } = await axios.get<AiModel[]>(`http://localhost:3000/models_costum_format`);
    setData(data);
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
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
      setError(`Unexpected error: ${err?.message || 'Unknown error occurred'}`);
    }
  }
}

export async function getModelsPaths(
  setData: (paths: string[]) => void,
  setError: Function
) {
  try {
    const { data } = await axios.get<string[]>(`http://localhost:3000/models_paths`);
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
        `Network error — no response received when attempting to reach http://localhost:3000/models_paths.`
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
    const { data: responseMessage } = await axios.get<string>(`http://localhost:3000/get_valid_study_lmstudio`);
    setData(responseMessage);
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg = typeof respData === 'string' ? respData : (respData?.message || respData?.error || statusText || "Unknown server error");

      setError(
        `Unable to validate study — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(
        `Network error — no response received when attempting to reach http://localhost:3000/get_valid_study_lmstudio.`
      );
    } else {
      setError(`Unexpected error while fetching validation: ${err.message}`);
    }
  }
}

interface AiModel {}