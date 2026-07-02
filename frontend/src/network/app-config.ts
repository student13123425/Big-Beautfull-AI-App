import axios from "axios";
import { Config } from "../scripts/objects";
import { addr } from "./utils";

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
        responseType: 'text',
      }
    );

    const text = response.data.trim().toLowerCase();
    if (text === 'y') return true;
    if (text === 'n') return false;
    
    setError(`DeactivateErrorMessage: Unexpected response: "${text}"`);
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
      
      setError(`DeactivateErrorMessage: ${errorMsg}`);
    } else if (error.request) {
      setError('DeactivateErrorMessage: No response from server');
    } else {
      setError(`DeactivateErrorMessage: Request setup error: ${error.message}`);
    }
    
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
    if (config.loadFrom(data)) {
      setConfig(config);
    } else {
      setError(
        "Failed to load configuration — the data received from the server was invalid."
      );
    }
  } catch (err: any) {
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
    else if (err.request) {
      setError(
        `Network error — no response received when attempting to reach ${addr}/config.`
      );
    }
    else {
      setError(`Unexpected error while fetching configuration: ${err.message}`);
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

