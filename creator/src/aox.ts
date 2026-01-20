import fs from "fs/promises"
import { AiServerError, FishierMaterie, Global, Quiz, QuiZRequestItem } from "./objects.js";
import { BaseLoadModelOpts, Chat,  LLMLoadModelConfig, LMStudioClient, ModelInfo } from "@lmstudio/sdk";

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
    language: string // Language for detailed_markdown (e.g., "română", "engleză")
  ): string {
    return `
  **Prompt pentru evaluare AI (Ieșire JSON necesară):**
  
  Sunteți un expert în evaluarea răspunsurilor studenților. Pe baza următoarelor detalii, oferiți o răspuns JSON cu:
  - 'score' (un întreg între 0 și 100)
  - 'detailed_markdown' (o explicație detaliată în limba specificată)
  
  **Intrare:**
  - **Întrebare**: "${question}"
  - **Răspunsul utilizatorului**: "${userAnswer}"
  - **Subiect**: "${subjectName}"
  
  **Instrucțiuni pentru AI:**
  1. Analizați răspunsul utilizatorului în contextul întrebării și subiectului.
  2. Atribuiți un scor (0-100) pe baza acurateții, completitudinii și relevanței.
  3. Scrieți o explicație detaliată în limba "${language}":
     - **Partea corectă**: Listați ce a fost corect.
     - **Partea incorectă**: Punctați erorile sau lipsurile.
     - **Sugestii de îmbunătățire**: Sugerarea modului de a corecta greșelile.
  
  **Formatul output (JSON):**
  {
    "score": 85,
    "detailed_markdown": "## Rezumat Evaluare\n- **Corect**: Utilizatorul a identificat corect [X]. \n- **Incorect**: A înțeles greșit [Y]. \n- **Îmbunătățire**: Revizuiește [Z] pentru claritate."
  }
  `;
  }
  

function prompt_sumarizare(materie: string, nume_materie: string, limbaj: string = "română"): string {
  return `
Generează o sinteză completă și autosuficientă în format Markdown pentru materia de ${nume_materie}, bazată exclusiv pe textul furnizat. 

### Cerințe esențiale:
1. **Autosuficiență totală**:
   - Conține TOATE informațiile necesare pentru a învăța materia fără a consulta textul original sau alte resurse
   - Elimină orice mențiune de tip "după cum se vede în text" sau referințe externe

2. **Limbaj de ieșire**: 
   - Toată sintesa trebuie să fie în ${limbaj}

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

import { getTextExtractor } from 'office-text-extractor';
import { existsSync } from 'fs';

// Synchronous wrapper
export async function extractTextFromOfficeFileAsync(filePath: string): Promise<string> {
    validateFileExists(filePath); 
    try {
        const content: string = await getTextExtractor().extractText({ input: filePath, type: 'file' });
        return content;
    } catch (err) {
        // err is already an Error object from the catch of extractText
        // or could be another error type if not strictly Error.
        // We'll re-throw it to propagate.
        if (err instanceof Error) {
            throw err;
        } else {
            // If it's not an Error instance, wrap it in one
            throw new Error(`An unknown error occurred during text extraction: ${String(err)}`);
        }
    }
}
// Sync validation
function validateFileExists(filePath: string) {
    if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    } 
}

// Type-specific sync versions
async function extractTextFromWordSync(filePath: string): Promise<string> {
    return await extractTextFromOfficeFileAsync(filePath);
}

async function extractTextFromPowerPointSync(filePath: string): Promise<string> {
    return extractTextFromOfficeFileAsync(filePath);
}


async function extract_text(file_path: string): Promise<string | null> {
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
    language: string = "română"
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

export function generate_quiz_question_prompt(nume_materie:string,file_content:string,numar_intrebari:number,is_grila:boolean):string{
  return `materie:${nume_materie}\n${file_content}\ncreaza un set de ${numar_intrebari} din a aceasta materie ${is_grila?'cu raspunsuri grila abcd fa toate rapunsurile sa para cat mai plauzibile':'in text cursiv din teoria din acest text fix sigur ca sa fie posibil sa raspund cu informatia din acest text intrebarie trebuie sa nu fie grila si sa se astepte la un raspuns scris'}fi sigur sa acoperi toata materia din text cat de bine posibil`
}

function get_file_name(path:string){
  let value=path.split('/').pop()
  if(value!==undefined)
    return value
  else
    return path
}
async function get_compleation(
  content: string,
  system_prompt: string,
  shouldContinue: () => boolean, // Pass by reference
  url: string,
  model_name: string,
  image_path: string | null,
  realTimeUpdate:Function|null,
  setError:(error:AiServerError)=>void,
  task_name:string
): Promise<string | null> {
  try {
    const client = await new LMStudioClient({ baseUrl: url });
    const config: BaseLoadModelOpts<LLMLoadModelConfig> = {
      config: { contextLength: 32 * 1000, evalBatchSize: 256 },
    };
    const model = await client.llm.model(model_name, config);

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

    // Check flag before and during generation
    for await (const fragment of model.respond(chat)) {
      if (!shouldContinue()) {
        console.log("Generation stopped by user");
        return null
      }
      console.log(output);
      output += fragment.content;
      if(typeof realTimeUpdate==="function")
        realTimeUpdate(output)
    }
    
    return get_output_content(output);
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
  //todo check
  if(!out.includes("<think>"))
    return ""
  return out.slice(7).split("</think>")[0];
}

export function get_output_content(out:string):string{
  //todo check
  if(!out.includes("<think>"))
    return out;
  return out.slice(7).split("</think>")[1];
}

  export {get_compleation,get_file_name,readPdf,getDirectoryContent,extract_text,prompt_quiz,prompt_sumarizare,is_model_available}
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
    // String.prototype.trim() drops whitespace; if a single-char string
    // is trimmed to empty, it was purely whitespace.
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
  limbaj: string = "română",
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

export function check_evaluation_parameters(quiz:any, raspunsuri:any):boolean{
    // Validate raspunsuri is an array of strings
    if (!Array.isArray(raspunsuri)) return false;
  
    for (const item of raspunsuri) {
      if (typeof item !== 'string') return false;
    }
  
    // Ensure quiz object has all required properties
    const requiredProperties = ['intrebari', 'is_grila', 'is_computing', 'title', 'is_failed'];
    
    for (const prop of requiredProperties) {
      if (!(prop in quiz)) return false;
    }
  
    // Validate types of each property
    if (!Array.isArray(quiz.intrebari)) return false;
    if (typeof quiz.is_grila !== 'boolean') return false;
    if (typeof quiz.is_computing !== 'boolean') return false;
    if (typeof quiz.title !== 'string') return false;
    if (typeof quiz.is_failed !== 'boolean') return false;
    // All validations passed
    return true;
}