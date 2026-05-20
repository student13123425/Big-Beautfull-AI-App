import { AiServerError, FileD, FishierMaterie, Quiz, QuiZRequestItem, type Materie, type StudyGroup } from "./objects";

export function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function get_selected(selected:string|null,data:StudyGroup):Materie|null{
  if(selected ===null)
      return null;
  for(let it of data.data)
    if(it.name.toLowerCase()===selected.toLowerCase())
      return it
  return null;
}

export function get_file_elements(m: Materie | null): FileD[] {
  if (!m) return [];
  return m.files.map(({ path }) => {
    const parts = path.split("\\");
    const name = parts[parts.length - 1];
    const idx = name.lastIndexOf(".");
    const file_type = idx >= 0 ? name.slice(idx + 1) : "";
    return new FileD(name, file_type);
  });
}

export function clampNumber(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') 
    throw new Error('All arguments must be valid numbers.');
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.min(Math.max(value, lower), upper);
}

export function getMaterieFile(name:string,materie:Materie):FishierMaterie|null{
  for(let it of materie.files)
    if(it.path===name)
      return it
  return null;
}

export function getTopLevePath(path:string):string{
  return path.split('/').pop() ?? path;
}

export function clone(obj:any){
  return JSON.parse(JSON.stringify(obj))
}

function parseColor(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace(/^#/, '');
  let short = clean;
  if (clean.length === 3) {
    // Convert #RGB to #RRGGBB format
    short = clean.split('').map(c => c + c).join('');
  }
  const r = parseInt(short.substring(0, 2), 16);
  const g = parseInt(short.substring(2, 4), 16);
  const b = parseInt(short.substring(4, 6), 16);
  return { r, g, b };
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function interpolateColors(color1: string, color2: string, t: number): string {
  const { r: r1, g: g1, b: b1 } = parseColor(color1);
  const { r: r2, g: g2, b: b2 } = parseColor(color2);
  const r = Math.max(0, Math.min(255, Math.round(r1 + t * (r2 - r1))));
  const g = Math.max(0, Math.min(255, Math.round(g1 + t * (g2 - g1))));
  const b = Math.max(0, Math.min(255, Math.round(b1 + t * (b2 - b1))));
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}


export function get_markdown_for_materie(it:Materie):string|null{
  if(!it.files.some((it=>it.sinteza!==null)))
    return null
  let out:string=""
  for(let i of it.files)
    if(i.sinteza!==null)
      out+=i.sinteza.trimEnd();+"\n";
  return out.trimEnd();
}

export function getSupportedFileTypes(): string[] {
  return ["PDF", "DOCX", "DOC", "PPT", "PPTX", "JPEG", "JPG", "PNG"];
}


export function containsVisible(text: string): boolean {
  // Common zero‑width & invisible Unicode code points
  const INVISIBLE = new Set([
    '\u200B', // ZERO WIDTH SPACE
    '\u200C', // ZERO WIDTH NON-JOINER
    '\u200D', // ZERO WIDTH JOINER
    '\u200E', // LEFT-TO-RIGHT MARK
    '\u200F', // RIGHT-TO-LEFT MARK
    '\u00AD', // SOFT HYPHEN
    '\uFEFF', // ZERO WIDTH NO-BREAK SPACE (BOM)
  ]);

  for (const ch of text) {
    const isWhitespace = ch.trim() === '';
    if (!isWhitespace && !INVISIBLE.has(ch)) {
      return true;
    }
  }
  return false;
}

export function flattenArray<T>(arr: T[][]): T[] {
  let total = 0;
  for (const sub of arr) {
    total += sub.length;
  }
  const result = new Array<T>(total);
  let offset = 0;
  for (const sub of arr) {
    for (let i = 0; i < sub.length; i++) {
      result[offset + i] = sub[i];
    }
    offset += sub.length;
  }

  return result;
}


export function get_output_content(out: string | null): string {
  if(out&&!out.includes("<think>")) return out;
  if (!out||!out.includes("</think>")) return "";
  return out
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .trim();
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
  if (quizList.some((q) => q.title === title)||files.some((it)=>it.materie!=req.materie_name)) 
    return false;
  const validFiles = new Set(files.map((f) => f.path));
  return file_nume.every((name) => validFiles.has(name));
}

export function getSupportedLanguages():string[]{
  return [
    "English",
    "Mandarin Chinese",
    "Romanian",
    "Spanish",
    "Modern Standard Arabic",
    "French",
    "Portuguese",
    "Russian",
    "German",
    "Japanese",
    "Vietnamese",
    "Turkish",
    "Telugu",
  ]
}

export function extractMarkdown(input:string):string{
 if(!input.includes("```markdown"))
    return input
  let it:string=input.split("```markdown")[1];
  if(!it.includes('```'))
    return it
  return it.split("```")[0]
}
//todo config parameters check server side
export function getNumber(input: string): number | null {
    const match = input.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
}

export function get_is_computing(global: StudyGroup): boolean {
  if (global.CurrentAskedQuestion.is_computing) return true;
  return global.data.some((item) =>
    item.files.some((file) => file.is_computing) ||
    item.quizs.some((quiz) => quiz.is_computing)
  );
}

export function extractContent(input: string): string | null {
  if(input.includes("<think>")&&!input.includes("</think>"))
    return null;
  const result = input.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  return result.length > 0 ? result : null;
}


export function quiz_to_request(
  quiz: Quiz|null,
  materie_nume: string,
  setError: Function
): QuiZRequestItem {
  if (!quiz || !materie_nume) {
    setError("Invalid input: 'quiz' or 'materie_nume' is undefined.");
    throw new Error("Invalid input: 'quiz' or 'materie_nume' is undefined.");
  }

  if (!Array.isArray(quiz.intrebari)) {
    setError("Invalid quiz: No questions found in the quiz.");
    throw new Error("Invalid quiz: No questions found in the quiz.");
  }

  const file_nume = quiz.intrebari.map((group) => group.title);
  let nr_intrebari_pe_materie =0;
  if(quiz.intrebari.length>0)
    nr_intrebari_pe_materie=quiz.intrebari[0].intrebari.length;
  const is_grile = quiz.is_grila;

  return new QuiZRequestItem(
    file_nume,
    nr_intrebari_pe_materie,
    is_grile,
    quiz.title,
    materie_nume
  );
}

export type ComplexityScore = 1 | 2 | 3 | 4 | 5;

export interface PasswordEvaluation {
  score: ComplexityScore;
  feedback: string[];
}

export function evaluatePasswordComplexity(password: string): PasswordEvaluation {
  const feedback: string[] = [];
  let score = 1;

  if (!password) {
    return { score: 1, feedback: ["Password is empty."] };
  }

  const len = password.length;
  if (len < 6) {
    feedback.push("Too short.");
    return { score: 1, feedback };
  } else if (len >= 12) {
    score += 2;
  } else if (len >= 8) {
    score += 1;
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (varietyCount <= 1) {
    feedback.push("Use a mix of uppercase, lowercase, numbers, and symbols.");
    score = Math.min(score, 2);
  } else if (varietyCount === 2) {
    score += 1;
  } else if (varietyCount === 3) {
    score += 1;
  } else if (varietyCount === 4) {
    score += 1;
  }

  const isSequential = /(abc|123|qwerty|password)/i.test(password);
  if (isSequential) {
    feedback.push("Avoid common sequences or predictable patterns.");
    score = Math.max(1, score - 2);
  }

  const finalScore = Math.min(Math.max(score, 1), 5) as ComplexityScore;

  if (finalScore >= 4) {
    feedback.push("Strong password!");
  } else if (finalScore === 3) {
    feedback.push("Moderate security.");
  } else {
    feedback.push("Weak password. Try adding more variety or length.");
  }

  return {
    score: finalScore,
    feedback: [...new Set(feedback)],
  };
}
