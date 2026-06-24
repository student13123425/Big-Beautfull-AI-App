import { ModelInfo } from "@lmstudio/sdk";
import { Config } from "node-tesseract-ocr";
import { AiServerError } from "./AiTypes.js";
import { extract_text } from "../services/file-processor.js";
import { generateConversionMarkdownToHTMLPrompt, prompt_sumarizare } from "../ai/prompts.js";
import { get_model } from "../helpers.js";
import { get_compleation } from "../services/llm.js";
import { Quiz } from "./quiz.js";
import { htmlStyles, supported_models } from "../services/state.js";

export class Materie {
    name: string;
    quizs: Quiz[] = [];
    files: FishierMaterie[] = [];

    constructor(name: string) {
        this.name = name;
    }

    async generate_sinteza_all_files(
        models: ModelInfo[],
        config: Config,
        setError: (error: AiServerError) => void
    ) {
        const promises = this.files.map(it => new Promise<void>((resolve) => {
            it.genereaza_sinteza(
                models,
                (s: string) => { it.sinteza = s; },
                config,
                (e: AiServerError) => {
                    setError(e);
                    it.sinteza = null;
                    it.is_computing = false;
                    resolve();
                }
            );
        }));
        await Promise.all(promises);
    }

    get_is_computing(): boolean {
        return this.files.some(file =>
            file.is_computing ||
            this.quizs.some(quiz => quiz.is_computing)
        );
    }
}

export class FishierMaterie {
    path: string;
    sinteza: string | null = null;
    html_file: string | null = null;
    is_computing: boolean = false;
    content: string | null = null;
    materie: string;
    is_failed: boolean = false;
    file_type: string | null | undefined = null;

    private _contentLoadedPromise: Promise<void> | null = null;
    private _isContentLoaded: boolean = false;

    constructor(path: string, materie: string, save: Function, isFirst: boolean, config: Config) {
        this.path = path;
        this.materie = materie;
        if (path.split(".").length == 0) this.file_type = path.split(".").pop();
        if (this.file_type === undefined) this.file_type = null;

        if (isFirst) {
            this._contentLoadedPromise = extract_text(this.path, config).then((it: string) => {
                this.content = it;
                this._isContentLoaded = true;
                console.log(`[FishierMaterie] ✅ Content extracted for ${this.path}. Length: ${(it || "").length} chars`);
            }).catch(err => {
                console.error(`[FishierMaterie] ❌ Failed to extract text from ${this.path}:`, err);
                this._isContentLoaded = false;
            });
        } else {
            this._isContentLoaded = true;
        }
    }

    load(save: Function, config: Config) {
        this._contentLoadedPromise = extract_text(this.path, config).then((it: string) => {
            this.content = it;
            this._isContentLoaded = true;
            console.log(`[FishierMaterie] ✅ Content reloaded for ${this.path}. Length: ${(it || "").length} chars`);
        }).catch(err => {
            console.error(`[FishierMaterie] ❌ Failed to reload text from ${this.path}:`, err);
            this._isContentLoaded = false;
        });
    }

    private async ensureContentReady(): Promise<boolean> {
        if (this._contentLoadedPromise) {
            try {
                await this._contentLoadedPromise;
            } catch (e) {
                console.error(`[FishierMaterie] ❌ Content loading failed for ${this.path}`);
                return false;
            }
        }
        return !!this.content && this.content.trim().length > 0;
    }

    async genereaza_sinteza(models: ModelInfo[], onUpdate: Function, config: Config, setError: (error: AiServerError) => void): Promise<void> {
        console.log(`[FishierMaterie] >>> Starting sinteza generation for ${this.path}`);

        if (this.is_computing) {
            console.warn(`[FishierMaterie] ⚠️ Already computing. Ignoring duplicate request.`);
            return;
        }
        if (this.sinteza != null && this.sinteza.trim().length > 0) {
            console.log(`[FishierMaterie] ✅ Sinteza already exists. Skipping generation.`);
            onUpdate();
            return;
        }

        const hasContent = await this.ensureContentReady();
        if (!hasContent) {
            console.error(`[FishierMaterie] ❌ Content not available. Extraction failed or returned empty.`);
            setError(new AiServerError("Missing Content", `Text extraction failed or returned empty for ${this.path}`));
            return;
        }

        this.is_computing = true;
        console.log(`[FishierMaterie] 🚀 Proceeding to AI call...`);

        try {
            let prompt = prompt_sumarizare(this.content!, this.materie, config.limba);
            
            // DEBUG: Log model matching details
            console.log(`[FishierMaterie] [DEBUG] models.length = ${models?.length || 0}`);
            if (models && models.length > 0) {
                console.log(`[FishierMaterie] [DEBUG] First 5 model paths:`);
                for (let i = 0; i < Math.min(5, models.length); i++) {
                    console.log(`[FishierMaterie] [DEBUG]   ${i + 1}. ${models[i].path}`);
                }
            } else {
                console.warn(`[FishierMaterie] [DEBUG] models array is empty or null!`);
            }
            
            const nume_model: string = supported_models?.[1]?.toLowerCase() || "";
            console.log(`[FishierMaterie] [DEBUG] Searching for model: "${nume_model}"`);
            console.log(`[FishierMaterie] [DEBUG] supported_models[1] = "${supported_models?.[1]}"`);
            
            const model_full = get_model(nume_model, models);

            if (!model_full) {
                console.error(`[FishierMaterie] ❌ Model not found on LM Studio server: ${nume_model}`);
                setError(new AiServerError("Invalid Model", `Model not found: ${nume_model}`));
                this.is_computing = false;
                return;
            }

            console.log(`[FishierMaterie] 🤖 Calling AI model: ${model_full.path}...`);
            this.sinteza = await get_compleation(
                prompt,
                config.system_prompt,
                () => this.is_computing,
                model_full.path,
                null,
                (s: string) => { this.sinteza = s; },
                setError,
                `generare sinteza pentru ${this.path}`,
                config
            );

            console.log(`[FishierMaterie] ✅ Sinteza generation complete. Length: ${(this.sinteza || "").length} chars`);
            onUpdate();
        } catch (e: any) {
            const errorMsg = e instanceof AiServerError ? e.message : String(e);
            console.error(`[FishierMaterie] ❌ AI Generation failed for ${this.path}:`, errorMsg, e);
            setError(new AiServerError("Eroare generare sinteza", `Erroare generare sinteza pentru ${this.path} using model ${nume_model}. Details: ${errorMsg}`));
        } finally {
            this.is_computing = false;
            console.log(`[FishierMaterie] 🔚 Generation process finished for ${this.path}.`);
        }
    }

    async regenerate_sinteza(models: ModelInfo[], onUpdate: Function, config: Config, setError: (error: AiServerError) => void): Promise<void> {
        console.log(`[FishierMaterie] 🔄 Regenerating sinteza for ${this.path}`);
        this.sinteza = null;
        await this.genereaza_sinteza(models, onUpdate, config, setError);
    }

    async generateHTML(models: ModelInfo[], onUpdate: Function, config: Config, setError: (error: AiServerError) => void, style: number): Promise<void> {
        console.log(`[FishierMaterie] >>> Starting HTML generation for ${this.path}`);

        if (this.is_computing) {
            console.warn(`[FishierMaterie] ⚠️ Already computing. Ignoring duplicate request.`);
            return;
        }

        const hasContent = await this.ensureContentReady();
        if (!hasContent) {
            console.error(`[FishierMaterie] ❌ Content not available for HTML generation.`);
            setError(new AiServerError("Missing Content", `Text extraction failed or returned empty`));
            return;
        }

        if (this.sinteza == null || this.sinteza.trim().length === 0) {
            console.error(`[FishierMaterie] ❌ Sinteza not generated yet.`);
            setError(new AiServerError("Missing Sinteza", "Sinteza must be generated before creating HTML."));
            return;
        }

        if (style < 0 || style >= 10) {
            console.error(`[FishierMaterie] ❌ Invalid style index: ${style}`);
            setError(new AiServerError("Invalid Style", `Style index must be between 0 and 9. Received: ${style}`));
            return;
        }

        this.is_computing = true;
        console.log(`[FishierMaterie] 🚀 Proceeding to HTML AI call...`);

        try {
            let prompt = generateConversionMarkdownToHTMLPrompt(this.sinteza, JSON.stringify(htmlStyles.getStyles()[style]), config.limba);
            const nume_model: string = supported_models?.[1]?.toLowerCase() || "";
            const model_full = get_model(nume_model, models);

            if (!model_full) {
                console.error(`[FishierMaterie] ❌ Model not found for HTML: ${nume_model}`);
                setError(new AiServerError("Invalid Model", `Model not found on LM Studio server: ${nume_model}`));
                this.is_computing = false;
                return;
            }

            console.log(`[FishierMaterie] 🤖 Calling AI model for HTML: ${model_full.path}...`);
            this.html_file = await get_compleation(
                prompt, config.system_prompt,
                () => this.is_computing, model_full.path, null,
                (s: string) => { this.html_file = s; }, 
                setError,
                `generare html pentru ${this.path}`,
                config
            );

            console.log(`[FishierMaterie] ✅ HTML generation complete.`);
            onUpdate();
        } catch (e: any) {
            const errorMsg = e instanceof AiServerError ? e.message : String(e);
            console.error(`[FishierMaterie] ❌ AI HTML Generation failed for ${this.path}:`, errorMsg, e);
            setError(new AiServerError("Eroare generare html", `Erroare generare html pentru ${this.path} using model ${nume_model}. Details: ${errorMsg}`));
        } finally {
            this.is_computing = false;
            console.log(`[FishierMaterie] 🔚 HTML generation process finished for ${this.path}.`);
        }
    }

    stopGeneratingSinteza(): void {
        if (this.is_computing) {
            console.log(`[FishierMaterie] 🛑 Stopping generation for ${this.path}...`);
            this.is_computing = false;
        }
    }
}
