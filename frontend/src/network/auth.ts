import axios from "axios";
import { addr } from "./utils";

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
      setError("Registration failed: No user ID received");
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
      setError("Login failed: No user ID received");
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


export async function verifyUserId(
  userId: string,
  setError: Function
): Promise<boolean> {
  try {
    const response = await axios.post(`${addr}/verify_token`, {
      userId,
    }, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text',
    });

    const data = response.data.trim();
    if (data === "null") {
      setError("Invalid or expired user ID");
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
      : `Network error during user ID verification: ${error.message}`;
    setError(message);
    return false;
  }
}

export async function getGuestUserId(
  setUserID: Function,
  setError: Function
): Promise<boolean> {
  try {
    const response = await axios.get(`${addr}/guestToken`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.userId) {
      setUserID(response.data.userId);
      return true;
    } else {
      setError("Failed to get guest user ID: No user ID received");
      return false;
    }
  } catch (error: any) {
    const message = error.response
      ? `Server error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error getting guest user ID: ${error.message}`;
    setError(message);
    return false;
  }
}