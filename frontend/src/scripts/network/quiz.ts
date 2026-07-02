import axios from "axios";
import { Quiz, QuiZRequestItem } from "../objects";
import { addr } from "./utils";

export async function submiForEvaluation(
  quiz: Quiz,
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
      responseType: 'text'
    });
    
    return response.data === 'y';
  } catch (error: any) {
    setError(`clear_evaluare failed to contact server ${error.message}`);
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
  setError: Function,
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
      return true;
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

