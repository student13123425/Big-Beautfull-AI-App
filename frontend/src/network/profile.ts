import axios from "axios";
import { addr } from "./utils";

export interface BirthdayResponse {
  birthday: string;
}

export async function fetchAuthorBirthday(): Promise<string | null> {
  try {
    const { data } = await axios.get<BirthdayResponse>(`${addr}/profile/birthday`);
    return data.birthday || null;
  } catch (err: any) {
    console.error("Failed to fetch author birthday:", err.message);
    return null;
  }
}