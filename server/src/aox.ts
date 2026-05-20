import fs, { constants } from "fs/promises"
import { createHash } from 'crypto';
import { AiServerError, Config, FishierMaterie, Global, Quiz, QuiZRequestItem, StudyGroup } from "./objects.js";
import { BaseLoadModelOpts, Chat,  LLMLoadModelConfig, LMStudioClient, ModelInfo } from "@lmstudio/sdk";
import libre from 'libreoffice-convert';
import tesseract from 'node-tesseract-ocr';
  function is_model_available(list:ModelInfo[],name:string):boolean{
    for(let it of list){
      if(it.displayName===name)
        return true
    }
    return false
  }

  export function promptEvaluareIntrebare(
  question: string,
  userAnswer: string,
  subjectName: string,
  language: string
): string {
  return `
Evaluează răspunsul meu la această întrebare. Nu aștepta un eseu sau răspuns lung - și răspunsurile scurte pot fi corecte dacă acoperă esențialul.

ÎNTREBARE: "${question}"
RĂSPUNSUL MEU: "${userAnswer}"
MATERIA: "${subjectName}"

**IMPORTANT:**
- Acceptă răspunsuri scurte dacă sunt corecte și arată înțelegere
- Nu penaliza pentru lipsa de detalii dacă ideea principală este acoperită
- Concentrează-te pe substanță, nu pe lungime
- Dacă răspunsul este corect dar scurt, dă un scor bun

Oferă-mi feedback direct (folosește "tu") în format JSON:
{
  "score": 0-100,
  "detailed_markdown": "explicație pentru tine"
}

În evaluare:
1. **Verifică dacă ai înțeles ideea principală** - nu dacă ai scris mult
2. **Dacă răspunsul este corect dar scurt**, explică ce ai făcut bine și cum poți extinde (fără să penalizezi)
3. **Dacă răspunsul este parțial corect**, indică doar ce lipsește, nu cere un eseu

Exemple de abordare:
- Răspuns scurt corect: "Ai identificat ideea principală corect. Poți adăuga exemple pentru a fi mai complet."
- Răspuns incomplet: "Ai prins o parte, dar lipsește X. Încearcă să te gândești la Y."
- Răspuns greșit: "Aici ai greșit conceptul. Ideea corectă este Z."

Răspuns JSON:
`;
}
function prompt_sumarizare(materie: string, nume_materie: string, limbaj: string): string {
  return `
Generează o sinteză completă și autosuficientă în format Markdown pentru materia de ${nume_materie}, bazată exclusiv pe textul furnizat. 

### Cerințe esențiale:
1. **Autosuficiență totală**:
   - Conține TOATE informațiile necesare pentru a învăța materia fără a consulta textul original sau alte resurse
   - Elimină orice mențiune de tip "după cum se vede în text" sau referințe externe

2. **Limbaj de ieșire**
   - Toată sinteza trebuie redactată în limba **${limbaj}** indiferent the limba materialului original.
   - Evită ambiguitățile; folosește un limbaj clar, concis și academic acolo unde este potrivit.


3. **Structură didactică** (folosind titluri Markdown):
   - Introducere conceptuală
   - Teorie esențială (definiții, reguli, formule)
   - Clasificări/tipologii (tabele comparative dacă sunt relevante)
   - Exemple aplicative (cu explicații pas-cu-pas)
   - Concluzii și relații între concepte

4. **Organizare optimă pentru învățare**:
   - Secvențează informația de la simplu la complex
   - Grupează concepte înrudite
   - Include elemente vizuale mentale (analogii, diagrame mentale descrise textual)
   - Highlight (cu **bold**) termeni-cheie și concepte fundamentale

5. **Formatare specială pentru formule**:
   - Toate formulele matematice/fizice/chimice să fie încadrate în \`\${formula}\` 
   - Exemplu: Pentru ecuația lui Einstein: \`\${E = mc^2}\`
   - Păstrează notația științifică corectă în interiorul \`\${}\`

### Text sursă:
${materie}

### Format de ieșire:
Strict Markdown cu:
- Titluri (##, ###) 
- Liste
- Tabele
- **Bold** pentru termeni importanți
- Formule în \`\${formula}\`
- Fără comentarii suplimentare
`.trim();
}

export function compareStudyGroup(a: any, b: any): boolean {
  if(a==null||b===null)
    return false
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

export function compareConfigs(a: Config, b: Config): boolean {
  if(a==null||b===null)
    return false
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


function prompt_extrage_text_img(nume_materie:string){
  return `extrage informatia si textul din aceasta imagine la materia ${nume_materie} si schematizeazo si explico cum ar fii probleme formule informati in paragrafe text si altele in cazul in care nu exista informati pertinete acestei materi raspunde explicand dc consideri asa`
}

function prompt_quiz(input:string,nume_materie:string,nr_intrebari:number,step:number,is_grila:boolean):string{
  const JsonFormat: string = `{
    "id": 1,
    "raspunsuri": [
      "React este o bibliotecă JavaScript pentru UI-uri",
      "React este un framework CSS",
      "React este un server web",
      "React este o bază de date NoSQL"
    ],
    "text_intrebare": "Ce este React?",
    "raspuns_correct_index": 0
  }`;
  if(step===0)
    return `${input}\nGenerează un test de ${nr_intrebari} întrebări ${is_grila?'cu răspunsuri multiple (a-d)':'cu cerinta in text cursiv un eu va trebui sa raspuns in text cursiv'} la materia ${nume_materie}`
  else
    return `${input}\nconverteste acest test grila intrun array de elemente de exact acest format \n${JsonFormat}\n rapunde duar cu textul json pt acest array`
}

export interface SanitizeOptions {
  replacement?: string;
  maxLength?: number;
  defaultName?: string;
  preserveUnicode?: boolean;
}

export function sanitizePath(inputPath:string) {
  const allowedDir = path.resolve("./data/");
  const resolved = path.resolve(inputPath);
  if (!resolved.startsWith(allowedDir)) {
    throw new Error("Invalid path");
  }
  return resolved;
}

export function sanitizeFilename(filename: string, options: SanitizeOptions = {}): string {
  const {
    replacement = '_',
    maxLength = 255,
    defaultName = 'file',
    preserveUnicode = false,
  } = options;

  if (!filename || typeof filename !== 'string') {
    return defaultName;
  }

  let sanitized = filename;

  if (!preserveUnicode) {
    sanitized = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  sanitized = sanitized
    .replace(/[\x00-\x1F\x7F]/g, '') 
    .replace(/[\\/:"*?<>|]/g, replacement) 
    .replace(/#/g, replacement) 
    .replace(/&/g, 'and') 
    .replace(/%/g, 'percent')
    .replace(/\$/g, 'dollar') 
    .replace(/\s+/g, ' ') 
    .replace(/^[\s.]+|[\s.]+$/g, '')
    .replace(/\.\.+/g, '.')
    .substring(0, maxLength);

  sanitized = sanitized.replace(/^\.+$/, replacement);

  return sanitized || defaultName;
}

import { getTextExtractor } from 'office-text-extractor';
import { access, existsSync } from 'fs';

export async function extractTextFromOfficeFileAsync(filePath: string): Promise<string> {
    validateFileExists(filePath); 
    try {
        const content: string = await getTextExtractor().extractText({ input: filePath, type: 'file' });
        return content;
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        } else {
            throw new Error(`An unknown error occurred during text extraction: ${String(err)}`);
        }
    }
}
function validateFileExists(filePath: string) {
    if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    } 
}

async function extractTextFromWordSync(filePath: string): Promise<string> {
    return await extractTextFromOfficeFileAsync(filePath);
}

async function extractTextFromPowerPointSync(filePath: string): Promise<string> {
    return extractTextFromOfficeFileAsync(filePath);
}

import { spawn } from 'child_process';

export async function convertPowerPointToPDF(inputPath: string, outputPdfPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const libreOfficePath = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
    const outputDir = path.dirname(outputPdfPath);
    
    const args = [
      '--headless',
      '--convert-to', 'pdf', 
      '--outdir', outputDir,
      inputPath
    ];

    console.log('Starting conversion with spawn...');
    console.log(`Command: ${libreOfficePath} ${args.join(' ')}`);

    const child = spawn(libreOfficePath, args, {
      timeout: 60000
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', async (code) => {
      if (code === 0) {
        console.log('LibreOffice process completed successfully');
        
        // Check for output file
        const inputBaseName = path.basename(inputPath, path.extname(inputPath));
        const expectedPdfPath = path.join(outputDir, inputBaseName + '.pdf');
        
        try {
          await fs.access(expectedPdfPath);
          console.log(`PDF created: ${expectedPdfPath}`);
          resolve(expectedPdfPath);
        } catch (error) {
          reject(new Error(`PDF file not found at ${expectedPdfPath}`));
        }
      } else {
        reject(new Error(`LibreOffice process failed with code ${code}. Stderr: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}
import util from 'util'

const execPromise = util.promisify(exec);

export async function testConversion() {
  const inputFile = "proiect birotica.pptx";
  const serverDir = path.resolve("./"); // Or the correct directory
  const libreOfficePath = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";

  // Construct the exact command that you know works
  const command = `& "${libreOfficePath}" --headless --convert-to pdf --outdir "${serverDir}" "${inputFile}"`;

  console.log('Testing direct shell command conversion...');
  console.log('Executing command:', command);

  try {
    // Execute the command. The { shell: 'powershell.exe' } option ensures it runs in PowerShell.
    const { stdout, stderr } = await execPromise(command, { cwd: serverDir, shell: 'powershell.exe' });

    if (stderr) {
      console.error('Stderr:', stderr);
    }
    console.log('Stdout:', stdout);
    
    console.log('🎉 Conversion completed successfully!');

  } catch (error) {
    console.error('❌ Error executing command:', error);
  }
}

export function onFileCreate(filePath: string, callback: () => void): void {
  const check = async (): Promise<void> => {
    try {
      await fs.stat(filePath);
      callback();
    } catch (err) {
      setTimeout(check, 100); 
    }
  };
  check();
}

async function extract_text(file_path: string,config:Config): Promise<string | null> {
    const start = Date.now(); // Start timing
    try {
        if (!file_path.includes(".")) {
            return null;
        }

        const file_type = file_path.split('.').pop()!.toLowerCase();

        if (file_type === "pdf") {
          return await readPdf(file_path);
        }
        else if (file_type === "ppt" || file_type === "pptx") {
            return await extractTextFromPowerPointSync(file_path);
        }
        else if (file_type === "doc" || file_type === "docx") {
            return await extractTextFromWordSync(file_path);
        }
        else if(file_type=="png"||file_type=="jpg"||file_type=="jpeg"){
          return await extractTextFromImage(file_path,config.limba,true)
        }
        return null;
    } finally {
        const duration = Date.now() - start;
        console.log(`extract time:${duration}ms`);
    }
}

export function is_file_image(path: string): boolean {
  const extension = path.split('.').pop()?.toLowerCase();
  return extension === 'png' || extension === 'jpeg'||extension==="jpg";
}

import { readdirSync, statSync, Dirent } from 'fs';
import { join, resolve } from 'path';

function getDirectoryContent(dirPath: string): string[] {
  try {
    const entries: Dirent[] = readdirSync(dirPath, { withFileTypes: true });
    const structure: string[] = [];

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const stats = statSync(fullPath);
      
      const baseEntry = {
        name: entry.name,
        path: resolve(fullPath),
        type: entry.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        mtime: stats.mtime
      };

      if (entry.isDirectory()) {
        const directoryEntry: string=baseEntry.name
        structure.push(directoryEntry);
      } else {
        structure.push(baseEntry.name);
      }
    }

    return structure;
  } catch (error) {
    console.error(`Error reading directory: ${dirPath}`, error);
    return [];
  }
}
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";
async function readPdf(filePath: string): Promise<string>{
   try {
    const absolutePath = path.resolve(filePath);
    await fs.access(absolutePath, fs.constants.F_OK);
    
    // Dynamic import of pdf2json
    const PDFParser = (await import('pdf2json')).default;
    
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        reject(new Error(`PDF parsing error: ${errData.parserError}`));
      });
      
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          let fullText = '';
          
          // Extract text from all pages
          if (pdfData.Pages) {
            for (const page of pdfData.Pages) {
              if (page.Texts) {
                for (const textItem of page.Texts) {
                  if (textItem.R) {
                    for (const textRun of textItem.R) {
                      if (textRun.T) {
                        // Decode URI component (pdf2json encodes text)
                        const decodedText = decodeURIComponent(textRun.T);
                        fullText += decodedText + ' ';
                      }
                    }
                  }
                }
              }
              fullText += '\n'; // Add line break between pages
            }
          }
          
          resolve(fullText.trim());
        } catch (parseError) {
          reject(new Error(`Error processing PDF data: ${parseError}`));
        }
      });
      
      // Load PDF file
      pdfParser.loadPDF(absolutePath);
    });
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
    throw new Error('Failed to extract text from PDF: Unknown error');
  }
}

export function get_question_prompt(
    materieName: string,
    file_content: string,
    question: string,
    language: string
): string {
    return `
CONȚINUT TEXTUAL PENTRU MATERIA "${materieName}":
${file_content}

ÎNTREBARE: ${question}

INSTRUCȚIUNI:
1. Răspunde EXCLUSIV pe baza informațiilor din textul de mai sus
2. Dacă întrebarea nu are răspuns în text, spune "Nu găsesc informații relevante în text"
3. Formulează răspunsul clar și concis în limba ${language}
4. Păstrează acuratețea informațiilor originale
5. Nu adăuga concluzii sau informații externe textului`;
}
export function to_json_prompt(format:string,content:string,context:string|null=null):string{
  return `convert this plain text data ${content} to json of this exact format ${format} ${context==null?"":`this is some more context of what this data is ${context} respond with only the json text with no markdown or any other text or details of any kind`} `
}

export function generate_quiz_question_prompt(nume_materie:string,file_content:string,numar_intrebari:number,is_grila:boolean,language:string):string{
  return `materie:${nume_materie}\n${file_content}\ncreaza un set de ${numar_intrebari} din a aceasta materie ${is_grila?'cu raspunsuri grila abcd fa toate rapunsurile sa para cat mai plauzibile':'in text cursiv din teoria din acest text fix sigur ca sa fie posibil sa raspund cu informatia din acest text intrebarie trebuie sa nu fie grila si sa se astepte la un raspuns scris'}fi sigur sa acoperi toata materia din text cat de bine posibil`
}

function get_file_name(path:string){
  let value=path.split('/').pop()
  if(value!==undefined)
    return value
  else
    return path
}
function removeXmlStyleTags(text: string): string {
  if (text.includes("<|message|>"))
    return text.split("<|message|>").pop();
  else if (text.includes("<|channel|>"))
    return "";
  else
    return text;
}

function extractFinalContent(text: string): string {
  const startMarker = "<|start|>assistant<|channel|>final<|message|>";
  const endMarkers = ["<|end|>", "<|return|>"];
  
  let lastIndex = 0;
  let result = "";
  
  // Find the LAST occurrence only
  const lastStartIndex = text.lastIndexOf(startMarker);
  
  if (lastStartIndex === -1) {
    return ""; // No start marker found
  }
  
  const contentStart = lastStartIndex + startMarker.length;
  
  // Find the earliest end marker after the start
  let contentEnd = text.length;
  for (const marker of endMarkers) {
    const markerIndex = text.indexOf(marker, contentStart);
    if (markerIndex !== -1 && markerIndex < contentEnd) {
      contentEnd = markerIndex;
    }
  }
  
  // Extract only the content from the LAST occurrence
  result = text.substring(contentStart, contentEnd).trim();
  
  return ;
}

export async function countLinesInFolder(rootDir: string): Promise<number> {
  let total = 0;
  const entries = await fs.readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      total += await countLinesInFolder(fullPath);
    } else if (
      entry.isFile() &&
      /\.(ts|tsx)$/.test(entry.name)         
    ) {
      try {
        const content = await fs.readFile(fullPath, 'utf8');
        total += content.split(/\r?\n/).length;
      } catch (err) {
        console.warn(`Could not read ${fullPath}:`, err);
      }
    }
  }

  return total;
}

export async function evaluate_code_complexity(): Promise<void> {
  const targetPaths: string[] = [
    '../server/src',
    '../study/src'
  ];

  let totalLines = 0;

  for (const dirPath of targetPaths) {
    try {
      const resolvedPath = path.resolve(dirPath);
      const stats = await fs.stat(resolvedPath);
      if (!stats.isDirectory()) continue;

      console.log(`Counting lines in: ${resolvedPath}`);
      totalLines += await countLinesInFolder(resolvedPath);
    } catch (error) {
      console.warn(`Could not access path "${dirPath}". Skipping.`, error);
    }
  }

  console.log(`Your code of this app has ${totalLines.toLocaleString()} lines of code`);
}

export async function imageContainsText(
  imagePath: string, 
  lang: string = "English",
  minTextLength: number = 3
): Promise<boolean> {
  const supportedLanguages = getSupportedLanguages();
  
  const langMap: Record<string, string> = {
    "English": "eng",
    "Mandarin Chinese": "chi_sim",
    "Romanian": "ron",
    "Spanish": "spa",
    "Modern Standard Arabic": "ara",
    "French": "fra",
    "Portuguese": "por",
    "Russian": "rus",
    "German": "deu",
    "Japanese": "jpn",
    "Vietnamese": "vie",
    "Turkish": "tur",
    "Telugu": "tel",
  };

  if (!supportedLanguages.includes(lang)) {
    throw new Error(`Unsupported language: ${lang}. Supported languages are: ${supportedLanguages.join(', ')}`);
  }

  const config = {
    lang: langMap[lang],
    oem: 1,      // OCR Engine Mode (1 = Original Tesseract only)
    psm: 3,      // Page Segmentation Mode (3 = Fully automatic page segmentation)
  };

  try {
    const text = await tesseract.recognize(imagePath, config);
    const cleanedText = text.trim().replace(/\s+/g, ' ');
    
    // Return true if we found text longer than minTextLength characters
    return cleanedText.length >= minTextLength;
  } catch (error) {
    // If OCR fails, assume no text was found
    console.warn(`OCR processing failed: ${(error as Error).message}`);
    return false;
  }
}


export async function extractTextFromImage(
  imagePath: string, 
  lang: string,
  is_check: boolean
): Promise<string> {
  const supportedLanguages = getSupportedLanguages();

  const langMap: Record<string, string> = {
    "English": "eng",
    "Mandarin Chinese": "chi_sim",
    "Romanian": "ron",
    "Spanish": "spa",
    "Modern Standard Arabic": "ara",
    "French": "fra",
    "Portuguese": "por",
    "Russian": "rus",
    "German": "deu",
    "Japanese": "jpn",
    "Vietnamese": "vie",
    "Turkish": "tur",
    "Telugu": "tel",
  };

  if (!supportedLanguages.includes(lang)) 
    throw new Error(`Unsupported language: ${lang}. Supported languages are: ${supportedLanguages.join(', ')}`);

  const config = {
    lang: langMap[lang],
    oem: 1,
    psm: 3,
  };

  try {
    const text = await tesseract.recognize(imagePath, config);
    
    // If check is enabled and no meaningful text found, return error string
    if (is_check) {
      const cleanedText = text.trim().replace(/\s+/g, ' ');
      if (cleanedText.length < 3) {
        return "no text has been found in this image Error 404";
      }
    }
    
    return text;
  } catch (error) {
    throw new Error(`Failed to extract text: ${(error as Error).message}`);
  }
}

export function clampNumber(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') 
    throw new Error('All arguments must be valid numbers.');
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.min(Math.max(value, lower), upper);
}

export function LimitString(str: string, n: number): string {
  if (typeof str !== "string" || typeof n !== "number" || n < 0) {
    return "";
  }
  return str.slice(0, n);
}

async function get_compleation(
  content: string,
  system_prompt: string,
  shouldContinue: () => boolean, // Pass by reference
  url: string,
  model_name: string,
  image_path: string | null,
  realTimeUpdate: Function | null,
  setError: (error: AiServerError) => void,
  task_name: string,
  cfg:Config
): Promise<string | null> {
  try {
    const client = await new LMStudioClient({ baseUrl: url });
    const config: BaseLoadModelOpts<LLMLoadModelConfig> = {
      config: { contextLength: cfg.model_token_limit, evalBatchSize: 512 },
    };
    const model = await client.llm.model(model_name, config);

    // Keep original system_prompt unchanged (you already did that).
    if (model_name === "gpt-oss") {
      system_prompt = system_prompt;
    }

    const messages: any[] = [
      { role: 'system', content: system_prompt },
      { role: 'user', content: image_path ?
        [
          { type: 'text', text: content },
          { type: 'image_url', image_url: { url: image_path } }
        ] : content
      }
    ];

    const chat = Chat.from(messages);
    let output = "";
    let reasoningBuffer = ""; // store reasoning fragments if present

    // Prepare prediction (try modern SDK shape, fallback to alternate shapes)
    let prediction: AsyncIterable<any>;
    try {
      if (model_name === "gpt-oss") {
        // Preferred/modern shape: pass inference options with reasoning_effort
        prediction = model.respond(chat, { inference: { reasoning_effort: "high" } });
      } else {
        // For other models, do a plain respond (no extra inference options)
        prediction = model.respond(chat);
      }
    } catch (err1) {
      // Fallback: try alternate envelope (some SDK versions expect an object)
      try {
        if (model_name === "gpt-oss") {
          prediction = model.respond({
            messages: chat,
            reasoning_effort: "high"
          } as any);
        } else {
          prediction = model.respond(chat);
        }
      } catch (err2) {
        // Last fallback: call respond without any extra params
        console.warn("model.respond with inference options failed, falling back to basic respond.", err1, err2);
        prediction = model.respond(chat);
      }
    }

    for await (const fragment of prediction) {
      if (!shouldContinue()) {
        console.log("Generation stopped by user");
        return null;
      }

      // Many SDKs provide fragment.content; reasoning may appear in fragment.reasoning or fragment.delta.reasoning
      const contentFragment = (fragment && (fragment.content ?? fragment.delta?.content)) ?? "";
      const reasoningFragment = (fragment && (fragment.reasoning ?? fragment.delta?.reasoning)) ?? null;

      // If reasoning chunks exist, keep them separately (do not mix into final user-visible output).
      if (reasoningFragment) {
        // accumulate for debugging/inspection — do not force into finalFiltered unless you want to expose chain-of-thought
        if (typeof reasoningFragment === "string") {
          reasoningBuffer += reasoningFragment;
        } else {
          // sometimes reasoningFragment may be an object/array; stringify carefully
          try {
            reasoningBuffer += JSON.stringify(reasoningFragment);
          } catch {
            reasoningBuffer += String(reasoningFragment);
          }
        }
        console.log("REASONING FRAGMENT:", reasoningFragment);
      }

      // Append the raw content fragment (if any)
      output += contentFragment;

      // **UPDATED FILTER HERE**: Use model-specific parsing
      let filteredOutput;
      if (model_name === "gpt-oss") {
        filteredOutput = extractFinalContent(output);
      } else {
        filteredOutput = removeXmlStyleTags(output);
      }

      // Log the filtered output to the console
      console.log(filteredOutput);

      // Send the filtered output for real-time UI updates
      if (typeof realTimeUpdate === "function") {
        // keep same API: send visible output string
        realTimeUpdate(filteredOutput);
      }
    }

    // **UPDATED FINAL FILTER HERE**: Apply the same model-specific logic
    let finalFiltered;
    if (model_name === "gpt-oss") {
      finalFiltered = extractFinalContent(output).trim();
    } else {
      finalFiltered = removeXmlStyleTags(output).trim();
    }

    // Optionally attach reasoningBuffer to logs so you can verify higher-effort reasoning occurred
    if (reasoningBuffer) {
      console.log(`Accumulated reasoning (truncated 2000 chars): ${reasoningBuffer.slice(0, 2000)}`);
    }

    return get_output_content(finalFiltered);

  } catch (e) {
    setError(
      new AiServerError(
        "eroare lmstudio",
        `lmstudio nu a reușit să genereze text pentru ${task_name} din cauza erorii ${e}`
      )
    );
    console.error(`Error generating content: ${e}`);
    return null;
  }
}

export function get_model(path: string, models: ModelInfo[]): ModelInfo | null {
  let out=models.find(m => m.path.toLowerCase() === path.toLowerCase());
  if(out===undefined)
    console.log("model_path: "+path);
  return out!==undefined?out:null
}

export function get_chain_of_reason(out:string):string{
  if(!out.includes("<think>"))
    return ""
  return out.slice(7).split("</think>")[0];
}

export function get_output_content(out:string):string{
  if(!out.includes("<think>"))
    return out;
  return out.slice(7).split("</think>")[1];
}

export async function getFolderSize(folderPath: string): Promise<number> {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      total += await getFolderSize(fullPath);
    } else if (entry.isFile()) {
      const stats = await fs.stat(fullPath);
      total += stats.size;
    }
  }
  return total;
}

  export {get_compleation,get_file_name,readPdf,getDirectoryContent,extract_text,prompt_quiz,prompt_sumarizare,is_model_available}
export function containsVisible(text: string): boolean {
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

export function get_json_from_text(input: string|null): string {
    if(input==null)
      return "null"
    const jsonStart = "```json";
    const startIdx = input.indexOf(jsonStart);
    
    if (startIdx === -1) return input;
    
    const dataStart = startIdx + jsonStart.length;
    const endIdx = input.indexOf("```", dataStart);
    
    return endIdx === -1 
        ? input.slice(dataStart) 
        : input.slice(dataStart, endIdx);
}


export function generate_quiz_json_prompt(
  nume_materie: string,
  file_content: string,
  numar_intrebari: number,
  is_grila: boolean,
  json_format: string,
  context: string | null = null,
  limbaj: string,
): string {
  return `
Generate a SINGLE JSON ARRAY containing ${numar_intrebari} question objects using this exact structure:
${json_format}

### Critical Requirements:
1. Output MUST be a SINGLE JSON ARRAY (e.g., [ {...}, {...} ])
2. Subject: ${nume_materie}
3. Output language: All content must be in ${limbaj}
4. Question type: ${is_grila ? 'Multiple-choice (ABCD) with plausible options' : 'Open-ended requiring written answers'}
5. ${is_grila ? '' : 'Answers must strictly use provided text'}
6. Cover key concepts comprehensively
${context ? `\n### Additional Context:\n${context}` : ''}

### Source Material:
${file_content}

Respond ONLY with valid JSON. No additional text, explanations, or markdown.
`.trim();
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


export function check_evaluation_parameters(quiz: any, raspunsuri: any,is_debug:boolean): boolean {
    const errors: string[] = [];

    // Check if 'raspunsuri' is an array
    if (!Array.isArray(raspunsuri)) {
        errors.push("Error 1: 'raspunsuri' must be an array.");
    } else {
        // Validate each item in 'raspunsuri'
        for (let i = 0; i < raspunsuri.length; i++) {
            if (typeof raspunsuri[i] !== 'string') {
                errors.push(`Error ${i + 2}: Element at index ${i} must be a string. Found: ${typeof raspunsuri[i]}`);
            }
        }
    }

    // Check required properties in 'quiz'
    const requiredProperties = ['intrebari', 'is_grila', 'is_computing', 'title', 'is_failed'];
    for (const prop of requiredProperties) {
        if (!(prop in quiz)) {
            errors.push(`Error ${requiredProperties.indexOf(prop) + 3}: Quiz is missing the property: '${prop}'`);
        }
    }

    // Validate types of each property in 'quiz'
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

    // Print all validation errors
    if (errors.length > 0&&is_debug) {
        console.error("Validation failed. Reasons:");
        for (const error of errors) {
            console.error(error);
        }
        return false;
    }

    return true;
}

import { readFileSync } from "fs";
import { config } from "process";
import { StackFrame } from "stack-trace";
import { log } from "console";
import { text } from "stream/consumers";

export function get_content_filled_file_list(): string[] {
  let out: string[] = [];
  try {
    const json: string = readFileSync("./StudyGroups.json", "utf-8");
    const data: StudyGroup = JSON.parse(json);
    for (const m of data.data) {
      for (const f of m.files) {
        if (f.content !== null) {
          out.push(f.path);
        }
      }
    }
  } catch (error: any) {
    console.error("Error occurred while processing StudyGroups.json:", error.message);
    return [];
  }
  return out;
}

export async function evaluateDataSize(){
  const bytes = await getFolderSize("./data");
  if (bytes < 1024 * 1024 * 1024){
    const mb = bytes / (1024*1024);
    console.log(`data size: ${mb.toFixed(2)} MB`);
  } else {
    const gb = bytes / (1024*1024*1024);
    console.log(`data size: ${gb.toFixed(2)} GB`);
  }
}

export async function isLibreOfficeInstalled(): Promise<boolean> {
  try {
    await exec("soffice --version");
    return true;
  } catch (_) {
    const winPath = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
    try {
      await fs.access(winPath);
      return true;
    } catch (_) {
      return false;
    }
  }
}

export async function isTesseractInstalled(): Promise<boolean> {
  try {
    await exec("tesseract --version");
    return true;
  } catch (_) {
    return false;
  }
}

export function getServerOS(): "Windows" | "Linux" | "MacOS" | "Other" {
  const platform = process.platform;
  if (platform === 'win32') return 'Windows';
  if (platform === 'linux') return 'Linux';
  if (platform === 'darwin') return 'MacOS';
  return 'Other';
}


export async function check_dependecys():Promise<boolean[]> {
  const is_ocr:boolean=await isTesseractInstalled();
  const is_libre_office:boolean=await isLibreOfficeInstalled();
  console.log(`Tesseract is ${!is_ocr?'not working':'fully working'}`);
  console.log(`Libre Office is ${!is_libre_office?'not working':'fully working'}`);
  return [is_ocr,is_libre_office];
}



export async function isFolderSizeBiggerThan(size: number): Promise<boolean> {
  const folderPath:string="./data"
  const bytes = await getFolderSize(folderPath);
  return bytes > size * 1024 ** 3;
} 



export function generateUserFolderId(email: string, userId: number): string {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !Number.isInteger(userId) || userId <= 0) {
    throw new Error('Invalid email or userId');
  }

  const input = `${normalizedEmail}:${userId}`;

  return createHash('sha256').update(input).digest('hex').slice(0, 25);
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

