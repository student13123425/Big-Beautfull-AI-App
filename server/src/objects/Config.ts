import { existsSync, readFileSync, writeFileSync } from "fs";
import { clampNumber, LimitString } from "../helpers.js";
import { getSupportedLanguages } from "../services/ocr.js";
import { getUserConfig } from "../routes/auth.js";

export class Config {
    private _userId: string | undefined;
    model_token_limit: number;
    system_prompt: string;
    limba: string;
    is_saveing: boolean = false;
    html_style: number = 0;

    setUserId(userId: string | undefined): void {
        this._userId = userId;
    }

    private _getConfigPath(): string {
        return getUserConfig(this._userId);
    }

    save(path?: string) {
        if (this.is_saveing) return;
        this.is_saveing = true;
        try {
            const configData = {
                model_token_limit: this.model_token_limit,
                system_prompt: this.system_prompt,
                limba: this.limba,
                html_style: this.html_style
            };
            writeFileSync(path || this._getConfigPath(), JSON.stringify(configData, null, 2), "utf-8");
        } catch (err) {
            console.error("Failed to save config:", err);
        }
        this.is_saveing = false;
    }

    set_contentx_size(size: number) {
        this.model_token_limit = clampNumber(size, 20 * 1000, 128 * 1000);
        this.save();
    }

    set_model(value: string): void {
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

    set_html_style(value: number): void {
        if (value < 0 || value > 9) {
            this.html_style = 0;
        } else {
            this.html_style = value;
        }
        this.save();
    }

    constructor(
        model_token_limit: number = 1024 * 128, 
        system_prompt: string = "You are ChatGPT, a helpful AI assistant.",
        limba: string = "Romanian",
        html_style: number = 0
    ) {
        this.model_token_limit = model_token_limit;
        this.system_prompt = system_prompt;
        this.limba = limba;
        this.html_style = html_style;
    }

    load(path?: string): void {
        const effectivePath = path || this._getConfigPath();
        try {
            if (!existsSync(effectivePath)) {
                this.save(effectivePath);
                return;
            }
            const file = readFileSync(effectivePath, "utf-8");
            const configData = JSON.parse(file);
            this.loadFrom(configData);
        } catch (err) {
            console.error("Failed to load config:", err);
            this.save(effectivePath);
        }
    }

    loadFrom(obj: any): boolean {
        if (!obj) return false;
        let isValid = true;
        
        if (typeof obj.model_token_limit === "number") {
            this.model_token_limit = obj.model_token_limit;
        } else {
            isValid = false;
        }

        if (typeof obj.system_prompt === "string") {
            this.system_prompt = obj.system_prompt;
        } 
        else if (typeof obj.system_propmt === "string") {
            this.system_prompt = obj.system_propmt;
        }
        else {
            isValid = false;
        }

        if (typeof obj.limba === "string" && getSupportedLanguages().includes(obj.limba)) {
            this.limba = obj.limba;
        } else {
            isValid = false;
        }

        if (typeof obj.html_style === "number" && obj.html_style >= 0 && obj.html_style <= 9) {
            this.html_style = obj.html_style;
        } else {
            isValid = false;
            this.html_style = 0;
        }

        return isValid;
    }

    toString(): string {
        return JSON.stringify({
            model_token_limit: this.model_token_limit,
            system_prompt: this.system_prompt,
            limba: this.limba,
            html_style: this.html_style
        }, null, 2);
    }
}