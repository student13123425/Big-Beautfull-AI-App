import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function isLibreOfficeInstalled(): Promise<boolean> {
  try {
    await execPromise("soffice --version");
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
    await execPromise("tesseract --version");
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

export async function checkDependencies(): Promise<boolean[]> {
  const isOcr: boolean = await isTesseractInstalled();
  const isLibreOffice: boolean = await isLibreOfficeInstalled();
  console.log(`Tesseract is ${!isOcr ? 'not working' : 'fully working'}`);
  console.log(`Libre Office is ${!isLibreOffice ? 'not working' : 'fully working'}`);
  return [isOcr, isLibreOffice];
}

export async function isFolderSizeBiggerThan(sizeInGB: number): Promise<boolean> {
  const folderPath = "./data";
  const bytes = await getFolderSize(folderPath);
  return bytes > sizeInGB * Math.pow(1024, 3);
}

export async function evaluateDataSize(): Promise<void> {
  try {
    const bytes = await getFolderSize("./data");
    if (bytes < 1024 * 1024 * 1024) {
      const mb = bytes / (1024 * 1024);
      console.log(`data size: ${mb.toFixed(2)} MB`);
    } else {
      const gb = bytes / (1024 * 1024 * 1024);
      console.log(`data size: ${gb.toFixed(2)} GB`);
    }
  } catch (err) {
    console.error("Error evaluating data size:", err);
  }
}

export async function countLinesInFolder(rootDir: string): Promise<number> {
  let total = 0;
  try {
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
  } catch (error) {
    console.error(`Error reading directory ${rootDir}:`, error);
  }
  return total;
}

export async function evaluateCodeComplexity(): Promise<void> {
  const targetPaths: string[] = [
    '../server/src',
    '../study/src'
  ];

  let totalLines = 0;

  for (const dirPath of targetPaths) {
    try {
      const resolvedPath = path.resolve(dirPath);
      try {
        await fs.access(resolvedPath);
      } catch {
        continue; 
      }

      console.log(`Counting lines in: ${resolvedPath}`);
      totalLines += await countLinesInFolder(resolvedPath);
    } catch (error) {
      console.warn(`Could not access path "${dirPath}". Skipping.`, error);
    }
  }

  console.log(`Your code of this app has ${totalLines.toLocaleString()} lines of code`);
}

async function getFolderSize(folderPath: string): Promise<number> {
  let total = 0;
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(folderPath, entry.name);
      if (entry.isDirectory()) {
        total += await getFolderSize(fullPath);
      } else if (entry.isFile()) {
        const stats = await fs.stat(fullPath);
        total += stats.size;
      }
    }
  } catch (error) {
    return 0;
  }
  return total;
}
