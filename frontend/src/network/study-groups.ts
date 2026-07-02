import axios from "axios";
import { StudyGroup } from "../scripts/objects";
import { addr } from "./utils";

export async function get_data(
  setData: Function,
  setError: Function,
) {
  try {
    const { data } = await axios.get<StudyGroup>(`${addr}/study`);

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
      setError(
        `Network error — no response received when attempting to reach ${addr}/study.`
      );
    } else {
      setError(`Unexpected error while fetching configuration: ${err.message}`);
    }
  }
}

export async function add_materie(
  setError: Function,
  name: string
): Promise<boolean> {

  try {
    const response = await axios.post<string>(
      `${addr}/add_materie`,
      { name: name },
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
  name: string
): Promise<boolean> {
  try {
    const response = await axios.post<string>(
      `${addr}/delete_materie`,
      { name: name },
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