import { LMStudioClient, ModelInfo } from "@lmstudio/sdk";
import { compareConfigs, compareStudyGroup } from "./data_validation.js";
import { getServerOS, isFolderSizeBiggerThan, checkDependencies } from "./environment.js";
import { fileURLToPath } from "url";
import path from "path";
import { Config } from "node-tesseract-ocr";
import { StudyGroup } from "../objects/StudyGroup.js";
import { Config } from "../objects/Config.js";
export const port = 3000;
export const max_size: number = 20;
export const supported_models: string[] = [
  "lmstudio-community/Qwen3.6-35B-A3B-GGUF/Qwen3.6-35B-A3B-Q3_K_L.gguf",
  "openai/gpt-oss-20b",
  "lmstudio-community/gemma-3-27b-it-GGUF/gemma-3-27b-it-Q3_K_L.gguf"
];
export let isMemOverflow = false;
export let is_dependecy: boolean[] = [];
export let v_interval: any = null;
export let ai_models_available: ModelInfo[] = [];
export let device_ip: string | null = null;

export const config = new Config();
config.load(); // Ensure this is synchronous. If async, use `await config.load()` at module init.

export const data_study = new StudyGroup();
data_study.load(config); // ✅ CRITICAL FIX: Loads initial study state from config
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export let lastStudyData = null;
export let lastConfigData = null;

// Initialize dependency check on module load
checkDependencies().then((deps) => {
  is_dependecy = deps;
});

export const studyClients = new Set();
export const configClients = new Set();
export const server_os: string = getServerOS();

export function setConfig(value: Config | null): void {
  config.value = value; // Adjust if your Config class uses a setter or direct assignment
}

export function broadcastStudyData(): void {
  const currentData = data_study;
  if (!compareStudyGroup(lastStudyData, currentData)) {
    lastStudyData = JSON.parse(JSON.stringify(currentData));
    const message = JSON.stringify({ type: "study_update", data: currentData });
    studyClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(message);
    });
  }
}

export function broadcastConfigData(): void {
  const currentData = config;
  if (!compareConfigs(lastConfigData, currentData)) {
    lastConfigData = JSON.parse(JSON.stringify(currentData));
    const message = JSON.stringify({ type: "config_update", data: currentData });
    configClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(message);
    });
  }
}

export async function refresh(): Promise<void> {
  try {
    isMemOverflow = await isFolderSizeBiggerThan(max_size);
  } catch {
    isMemOverflow = false;
  }
}

export async function getLmStudioDevice(): Promise<string | null> {
  const targetIp = "127.0.0.1";
  const address = `ws://${targetIp}:1234`;

  try {
    console.log(`Attempting to connect to LM Studio at ${address}...`);
    const client = new LMStudioClient({ baseUrl: address });
    const models = await withTimeout(client.system.listDownloadedModels(), 2000, "Request timed out");
    ai_models_available = models;
    device_ip = address;
    console.log(`Successfully connected to LM Studio at ${address}`);
    return address;
  } catch (err) {
    console.error("LM Studio discovery failed:", err);
    return null;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage = "Operation timed out"): Promise<T> {
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), ms));
  return Promise.race([promise, timeout]);
}

export function set_v(value: number): void {
  v_interval = value;
}

export function set_device_id(value: string | null): void {
  device_ip = value;
}

export const allowedExtensions = [
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv",
  ".ods", ".odt", ".rtf", ".ppt", ".pptx",
  ".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"
];

export const deniedExtensions = [
  ".exe", ".dll", ".bat", ".com", ".cmd", ".lnk", ".vbs",
  ".msi", ".scr", ".py", ".js", ".sh", ".jar", ".ts", ".jsx", ".tsx"
];

export function setLastStudyData(value: any): void {
  lastStudyData = value;
}

export function setLastConfigData(value: any): void {
  lastConfigData = value;
}
