import axios from "axios";
import { StyleConfigList } from "../scripts/objects";
import { addr } from "./utils";

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

export async function getHtmlStyleConfig(
  setHtmlStyleValue: Function,
  setError: Function,
  userId: string | null = null
): Promise<void> {
  try {
    const url = `${addr}/htmlStyle?userId=${encodeURIComponent(userId ?? '')}`;
    const { data } = await axios.get(url);
    setHtmlStyleValue(data);
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        "Unknown server error";
      setError(
        `Unable to load html_style — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(
        `Network error — no response received when attempting to reach ${addr}/htmlStyle.`
      );
    } else {
      setError(`Unexpected error while fetching html_style: ${err.message}`);
    }
  }
}

export async function setHtmlStyleConfig(
  style: number,
  setError: Function,
  userId: string | null = null
): Promise<void> {
  try {
    const body: { style: number; userId?: string } = { style };
    if (userId) body.userId = userId;
    const { data } = await axios.post<string>(`${addr}/htmlStyle`, body);

    if (data === 'y') {
      return;
    }

    setError(`Server rejected html_style selection: received "${data}".`);
  } catch (err: any) {
    if (err.response) {
      const { status, data: respData, statusText } = err.response;
      const serverMsg =
        respData?.message ||
        respData?.error ||
        statusText ||
        "Unknown server error";
      setError(
        `Unable to set html_style — server responded with ${status}: ${serverMsg}.`
      );
    } else if (err.request) {
      setError(
        `Network error — no response received when attempting to reach ${addr}/htmlStyle.`
      );
    } else {
      setError(`Unexpected error while setting html_style: ${err.message}`);
    }
  }
}

