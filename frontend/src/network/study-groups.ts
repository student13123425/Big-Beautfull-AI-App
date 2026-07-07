import axios from "axios";
import { StudyGroup } from "../scripts/objects";
import { addr } from "./utils";

export async function get_data(
  setData: Function,
  setError: Function,
  userId: string | null = null,
) {
  try {
    const url = userId 
      ? `${addr}/study?userId=${encodeURIComponent(userId)}`
      : `${addr}/study`;
    const { data } = await axios.get<StudyGroup>(url);

    const freshCopy = JSON.parse(JSON.stringify(data));
    setData(freshCopy);
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
      const urlDesc = userId ? `${addr}/study?userId=***` : `${addr}/study`;
      setError(
        `Network error — no response received when attempting to reach ${urlDesc}.`
      );
    } else {
      setError(`Unexpected error while fetching configuration: ${err.message}`);
    }
  }
}

export async function add_materie(
  setError: Function,
  name: string,
  userId: string | null = null
): Promise<boolean> {

  try {
    const body: { name: string; userId?: string } = { name };
    if (userId) body.userId = userId;
    
    const response = await axios.post<string>(
      `${addr}/add_materie`,
      body,
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

export async function delete_materie(
  setError: Function,
  name: string,
  userId: string | null = null
): Promise<boolean> {
  try {
    const body: { name: string; userId?: string } = { name };
    if (userId) body.userId = userId;

    const response = await axios.post<string>(
      `${addr}/delete_materie`,
      body,
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