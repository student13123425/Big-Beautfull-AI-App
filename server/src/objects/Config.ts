import { existsSync, readFileSync, writeFileSync } from "fs";
import { clampNumber, LimitString } from "../helpers.js";
import { getSupportedLanguages } from "../services/ocr.js";

export class Config {
  model_token_limit: number;
  ip: string | null;
  ai_model_sinteza: string[];
  ai_model_question: string[];
  ai_model_quiz: string[];
  system_prompt: string;
  limba: string;
  is_saveing: boolean = false;

  save(path: string = "./config.json") {
    if (this.is_saveing) return;
    this.is_saveing = true;
    try {
      const configData = {
        model_token_limit: this.model_token_limit,
        ip: this.ip,
        ai_model_sinteza: this.ai_model_sinteza,
        ai_model_question: this.ai_model_question,
        ai_model_quiz: this.ai_model_quiz,
        system_prompt: this.system_prompt,
        limba: this.limba
      };
      writeFileSync(path, JSON.stringify(configData, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save config:", err);
    }
    this.is_saveing = false;
  }

  set_contentx_size(size: number) {
    this.model_token_limit = clampNumber(size, 20 * 1000, 64 * 1000);
    this.save();
  }

  set_model(value: string): void {
    for (let i = 0; i < this.ai_model_sinteza.length; i++) 
      this.ai_model_sinteza[i] = value;
    for (let i = 0; i < this.ai_model_quiz.length; i++) 
      this.ai_model_quiz[i] = value;
    for (let i = 0; i < this.ai_model_question.length; i++) 
      this.ai_model_question[i] = value;
    this.save();
  }

  setSystemPrompt(value: string) {
    this.system_prompt = LimitString(value, 5000);
    this.save();
  }

  set_language(value: string): void {
    this.limba = value;
    this.save();
  }

  constructor(
    model_token_limit: number = 1024 * 64, 
    ip: string | null = null,
    ai_model_sinteza: string[] = [
      "qwen3.6-35b-a3b", 
      "qwen3.6-35b-a3b"
    ],
    ai_model_question: string[] = [
      "deepseek/deepseek-r1-0528-qwen3-8b",
      "lmstudio-community/Qwen3-14B-GGUF/Qwen3-14B-Q4_K_M.gguf",
      "qwen3.6-35b-a3b"
    ],
    ai_model_quiz: string[] = [
      "qwen3.6-35b-a3b",
      "qwen3.6-35b-a3b"
    ],
    system_prompt: string = "You are ChatGPT, a helpful AI assistant.",
    limba: string = "Romanian"
  ) {
    this.model_token_limit = model_token_limit;
    this.ip = ip;
    this.ai_model_sinteza = ai_model_sinteza;
    this.ai_model_question = ai_model_question;
    this.ai_model_quiz = ai_model_quiz;
    this.system_prompt = system_prompt;
    this.limba = limba;
  }

  load(path: string = "./config.json"): void {
    console.log("Loading config from:", path);
    try {
      if (!existsSync(path)) {
        console.warn("Config file not found, saving default configuration");
        this.save(path);
        return;
      }
      const file = readFileSync(path, "utf-8");
      const configData = JSON.parse(file);
      this.loadFrom(configData);
    } catch (err) {
      console.error("Failed to load config:", err);
      this.save(path);
    }
  }

  loadFrom(obj: any): boolean {
    if (!obj) return false;
    let isValid = true;
    if (typeof obj.model_token_limit === "number") {
      this.model_token_limit = obj.model_token_limit;
    } else {
      isValid = false;
      console.warn("Invalid model_token_limit, using default");
    }
    if (obj.ip === null || typeof obj.ip === "string") {
      this.ip = obj.ip;
    } else {
      isValid = false;
      console.warn("Invalid IP, using default");
    }
    // Validate and load model arrays
    const validateModelArray = (arr: any, length: number): boolean => {
      return Array.isArray(arr) && 
             arr.length === length &&
             arr.every(item => typeof item === "string");
    };
    if (validateModelArray(obj.ai_model_sinteza, 2)) {
      this.ai_model_sinteza = obj.ai_model_sinteza;
    } else {
      isValid = false;
      console.warn("Invalid ai_model_sinteza, using default");
    }
    if (validateModelArray(obj.ai_model_question, 3)) {
      this.ai_model_question = obj.ai_model_question;
    } else {
      isValid = false;
      console.warn("Invalid ai_model_question, using default");
    }
    if (validateModelArray(obj.ai_model_quiz, 2)) {
      this.ai_model_quiz = obj.ai_model_quiz;
    } else {
      isValid = false;
      console.warn("Invalid ai_model_quiz, using default");
    }
    if (typeof obj.system_prompt === "string") {
      this.system_prompt = obj.system_prompt;
    } 
    else if (typeof obj.system_propmt === "string") {
      this.system_prompt = obj.system_propmt;
    }
    else {
      isValid = false;
      console.warn("Invalid system_prompt, using default");
    }
    if (typeof obj.limba === "string" && getSupportedLanguages().includes(obj.limba)) {
      this.limba = obj.limba;
    } else {
      isValid = false;
      console.warn("Invalid language setting, using default");
    }
    return isValid;
  }

  toString(): string {
    return JSON.stringify({
      model_token_limit: this.model_token_limit,
      ip: this.ip,
      ai_model_sinteza: this.ai_model_sinteza,
      ai_model_question: this.ai_model_question,
      ai_model_quiz: this.ai_model_quiz,
      system_prompt: this.system_prompt,
      limba: this.limba
    }, null, 2);
  }
}
