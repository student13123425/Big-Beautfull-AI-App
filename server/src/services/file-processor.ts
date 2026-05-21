import fs from "fs/promises";
import { constants } from "fs/promises";
import path from "path";
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { getTextExtractor } from 'office-text-extractor';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { StudyGroup } from "../objects.js";

const execPromise = promisify(exec);

export interface SanitizeOptions {
  replacement?: string;
  maxLength?: number;
  defaultName?: string;
  preserveUnicode?: boolean;
}

export function sanitizePath(inputPath: string): string {
  const allowedDir = path.resolve("./data/");
  const resolved = path.resolve(inputPath);
  if (!resolved.startsWith(allowedDir)) {
    throw new Error("Invalid path");
  }
  return resolved;
}

export function sanitizeFilename(filename: string, options: SanitizeOptions = {}): string {
  const { replacement = '_', maxLength = 255, defaultName = 'file', preserveUnicode = false } = options;
  if (!filename || typeof filename !== 'string') return defaultName;
  let sanitized = filename;
  if (!preserveUnicode) sanitized = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

export async function extractTextFromOfficeFileAsync(filePath: string): Promise<string> {
  validateFileExists(filePath); 
  try {
    const content: string = await getTextExtractor().extractText({ input: filePath, type: 'file' });
    return content;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error(`An unknown error occurred during text extraction: ${String(err)}`);
  }
}

function validateFileExists(filePath: string) {
  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`); 
}

async function extractTextFromWordSync(filePath: string): Promise<string> {
  return await extractTextFromOfficeFileAsync(filePath);
}

async function extractTextFromPowerPointSync(filePath: string): Promise<string> {
  return extractTextFromOfficeFileAsync(filePath);
}

export async function convertPowerPointToPDF(inputPath: string, outputPdfPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const libreOfficePath = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
    const outputDir = path.dirname(outputPdfPath);
    const args = ['--headless', '--convert-to', 'pdf', '--outdir', outputDir, inputPath];
    const child = spawn(libreOfficePath, args, { timeout: 60000 });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });
    child.on('close', async (code) => {
      if (code === 0) {
        const inputBaseName = path.basename(inputPath, path.extname(inputPath));
        const expectedPdfPath = path.join(outputDir, inputBaseName + '.pdf');
        try { await fs.access(expectedPdfPath); resolve(expectedPdfPath); }
        catch (error) { reject(new Error(`PDF file not found at ${expectedPdfPath}`)); }
      } else { reject(new Error(`LibreOffice process failed with code ${code}. Stderr: ${stderr}`)); }
    });
    child.on('error', (error) => { reject(error); });
  });
}

export async function testConversion() {
  const inputFile = "proiect birotica.pptx";
  const serverDir = path.resolve("./"); 
  const libreOfficePath = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
  const command = `& "${libreOfficePath}" --headless --convert-to pdf --outdir "${serverDir}" "${inputFile}"`;
  try {
    const { stdout, stderr } = await execPromise(command, { cwd: serverDir, shell: 'powershell.exe' });
    if (stderr) console.error('Stderr:', stderr);
    console.log('Stdout:', stdout);
  } catch (error) { console.error('❌ Error executing command:', error); }
}

export function onFileCreate(filePath: string, callback: () => void): void {
  const check = async (): Promise<void> => {
    try { await fs.stat(filePath); callback(); } 
    catch (err) { setTimeout(check, 100); }
  };
  check();
}

export async function extract_text(file_path: string, config: any): Promise<string | null> {
  const start = Date.now();
  try {
    if (!file_path.includes(".")) return null;
    const file_type = file_path.split('.').pop()!.toLowerCase();
    if (file_type === "pdf") return await readPdf(file_path);
    else if (file_type === "ppt" || file_type === "pptx") return await extractTextFromPowerPointSync(file_path);
    else if (file_type === "doc" || file_type === "docx") return await extractTextFromWordSync(file_path);
    else if(file_type=="png"||file_type=="jpg"||file_type=="jpeg") return await extractTextFromImage(file_path, config.limba, true);
    return null;
  } finally { console.log(`extract time:${Date.now() - start}ms`); }
}

export function is_file_image(path: string): boolean {
  const extension = path.split('.').pop()?.toLowerCase();
  return extension === 'png' || extension === 'jpeg'||extension==="jpg";
}

export function getDirectoryContent(dirPath: string): string[] {
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    const structure: string[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) structure.push(entry.name);
      else structure.push(entry.name);
    }
    return structure;
  } catch (error) { console.error(`Error reading directory: ${dirPath}`, error); return []; }
}

async function readPdf(filePath: string): Promise<string>{
  try {
    const absolutePath = path.resolve(filePath);
    await fs.access(absolutePath, constants.F_OK);
    const PDFParser = (await import('pdf2json')).default;
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      pdfParser.on('pdfParser_dataError', (errData: any) => { reject(new Error(`PDF parsing error: ${errData.parserError}`)); });
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          let fullText = '';
          if (pdfData.Pages) {
            for (const page of pdfData.Pages) {
              if (page.Texts) {
                for (const textItem of page.Texts) {
                  if (textItem.R) {
                    for (const textRun of textItem.R) {
                      if (textRun.T) fullText += decodeURIComponent(textRun.T) + ' ';
                    }
                  }
                }
              }
              fullText += '\n';
            }
          }
          resolve(fullText.trim());
        } catch (parseError) { reject(new Error(`Error processing PDF data: ${parseError}`)); }
      });
      pdfParser.loadPDF(absolutePath);
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(`Failed to extract text from PDF: ${error.message}`);
    throw new Error('Failed to extract text from PDF: Unknown error');
  }
}

export function get_file_name(path: string){
  let value=path.split('/').pop()
  if(value!==undefined) return value;
  else return path;
}

export function get_content_filled_file_list(): string[] {
  let out: string[] = [];
  try {
    const json: string = readFileSync("./StudyGroups.json", "utf-8");
    const data: StudyGroup = JSON.parse(json);
    for (const m of data.data) {
      for (const f of m.files) {
        if (f.content !== null) out.push(f.path);
      }
    }
  } catch (error: any) { console.error("Error occurred while processing StudyGroups.json:", error.message); return []; }
  return out;
}
