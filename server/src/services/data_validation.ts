import { Quiz, QuiZRequestItem, FishierMaterie } from "../objects.js";

export function compareStudyGroup(a: any, b: any): boolean {
  if (a == null || b === null) return false;
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b)) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!compareStudyGroup(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    }
    for (const key of keysA) {
      if (!compareStudyGroup(a[key], b[key])) return false;
    }
    return true;
  }

  return a === b;
}

export function compareConfigs(a: any, b: any): boolean {
  if (a == null || b === null) return false;

  const arraysEqual = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  return a.model_token_limit === b.model_token_limit &&
         a.ip === b.ip &&
         arraysEqual(a.ai_model_sinteza, b.ai_model_sinteza) &&
         arraysEqual(a.ai_model_question, b.ai_model_question) &&
         arraysEqual(a.ai_model_quiz, b.ai_model_quiz) &&
         a.system_prompt === b.system_prompt &&
         a.limba === b.limba;
}

export function check_evaluation_parameters(quiz: any, raspunsuri: any, is_debug: boolean): boolean {
  const errors: string[] = [];

  if (!Array.isArray(raspunsuri)) {
    errors.push("Error 1: 'raspunsuri' must be an array.");
  } else {
    for (let i = 0; i < raspunsuri.length; i++) {
      if (typeof raspunsuri[i] !== 'string') {
        errors.push(`Error ${i + 2}: Element at index ${i} must be a string. Found: ${typeof raspunsuri[i]}`);
      }
    }
  }

  const requiredProperties = ['intrebari', 'is_grila', 'is_computing', 'title', 'is_failed'];
  for (const prop of requiredProperties) {
    if (!(prop in quiz)) {
      errors.push(`Error ${requiredProperties.indexOf(prop) + 3}: Quiz is missing the property: '${prop}'`);
    }
  }

  if (!Array.isArray(quiz.intrebari)) {
    errors.push("Error 7: 'intrebari' must be an array.");
  }
  if (typeof quiz.is_grila !== 'boolean') {
    errors.push("Error 8: 'is_grila' must be a boolean.");
  }
  if (typeof quiz.is_computing !== 'boolean') {
    errors.push("Error 9: 'is_computing' must be a boolean.");
  }
  if (typeof quiz.title !== 'string') {
    errors.push("Error 10: 'title' must be a string.");
  }
  if (typeof quiz.is_failed !== 'boolean') {
    errors.push("Error 11: 'is_failed' must be a boolean.");
  }

  if (errors.length > 0 && is_debug) {
    console.error("Validation failed. Reasons:");
    for (const error of errors) {
      console.error(error);
    }
    return false;
  }

  return true;
}

export function isValidQuizItem(
  req: QuiZRequestItem,
  quizList: Quiz[],
  files: FishierMaterie[]
): boolean {
  const { file_nume, title, nr_intrebari_pe_materie } = req;
  if (
    file_nume.length === 0 ||
    !containsVisible(title) ||
    nr_intrebari_pe_materie === 0
  ) {
    return false;
  }
  if (quizList.some((q) => q.title === title) || files.some((it) => it.materie !== req.materie_name)) {
    return false;
  }
  const validFiles = new Set(files.map((f) => f.path));
  return file_nume.every((name) => validFiles.has(name));
}

export function containsVisible(text: string): boolean {
  const INVISIBLE = new Set([
    '\u200B', 
    '\u200C', 
    '\u200D', 
    '\u200E', 
    '\u200F', 
    '\u00AD', 
    '\uFEFF', 
  ]);

  for (const ch of text) {
    const isWhitespace = ch.trim() === '';
    if (!isWhitespace && !INVISIBLE.has(ch)) {
      return true;
    }
  }
  return false;
}

export function get_json_from_text(input: string | null): string {
  if (input == null) return "null";
  const jsonStart = "```json";
  const startIdx = input.indexOf(jsonStart);
  if (startIdx === -1) return input;
  const dataStart = startIdx + jsonStart.length;
  const endIdx = input.indexOf("```", dataStart);
  return endIdx === -1 
    ? input.slice(dataStart) 
    : input.slice(dataStart, endIdx);
}
