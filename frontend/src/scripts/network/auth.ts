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

export async function getGuestToken(
  setToken: Function,
  setError: Function
): Promise<boolean> {
  try {
    const response = await axios.get(`${addr}/guestToken`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.token) {
      setToken(response.data.token);
      return true;
    } else {
      setError("Failed to get guest token: No token received");
      return false;
    }
  } catch (error: any) {
    const message = error.response
      ? `Server error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`
      : `Network error getting guest token: ${error.message}`;
    setError(message);
    return false;
  }
}