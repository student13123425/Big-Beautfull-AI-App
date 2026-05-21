import { ModelInfo } from "@lmstudio/sdk";
import { Config } from "node-tesseract-ocr";
import { get_json_from_text } from "../services/data_validation.js";
import { get_compleation } from "../services/llm.js";
import { generate_quiz_json_prompt } from "../ai/prompts.js";
import { AiServerError } from "./AiTypes.js";
import { FishierMaterie } from "./subjects.js";

export class Intrebare {
  id: number = -1;
  raspunsuri: string[] = [];
  text_intrebare: string = "";
  raspuns_correct_index: number = -1;
  is_failed: boolean = false;
  constructor() {}
}

export class GroupIntrebare {
  title: string = "";
  intrebari: Intrebare[] = [];
}

export class Quiz {
  intrebari: GroupIntrebare[] = [];
  is_grila: boolean = false;
  is_computing: boolean = false;
  title: string = "";
  is_failed: boolean = false;
  constructor() {}

 async genereate(nr_intrebari_per_fishier: number, materie: string[], nume_materie: string[], is_grila: boolean, models: ModelInfo[], baseUrl: string, onUpdate: Function, config: Config, setError: (error: AiServerError) => void): Promise<void> {
    this.is_computing = true;
    let c = 0;

    for (let i in nume_materie) {
      const group = new GroupIntrebare();
      group.title = nume_materie[i];

      this.intrebari.push(group);

      for (let j = 0; j < nr_intrebari_per_fishier; j++) {
        const emptyQuestion = new Intrebare();
        emptyQuestion.text_intrebare = ""; // Placeholder text
        group.intrebari.push(emptyQuestion);
      }
      console.log("is_grila",is_grila);
      
      let prompt: string = generate_quiz_json_prompt(
        nume_materie[i],
        materie[i],
        nr_intrebari_per_fishier,
        is_grila,
        `[${is_grila 
          ? `{
            "text_intrebare": "Question text?",
            "raspunsuri": ["Option A", "Option B", "Option C", "Option D"],
            "raspuns_correct_index": 0
          }`
          : `{"text_intrebare": "Question text?"}`
        }]`,
        "intrebari pt un quiz la aceasta materie",
        config.limba
      );

      let output: string | null = await get_compleation(
        prompt,
        config.system_prompt,
        () => this.is_computing,
        baseUrl,
        config.ai_model_quiz[0],
        null,
        (s: string) => {},
        setError,
        `generare quiz la ${nume_materie[i]}`,
        config
      );

      if (output) {
        try {
          let data: Intrebare[] = JSON.parse(get_json_from_text(output));

          for (let i = 0; i < data.length; i++) {
            const generatedQuestion = data[i];
            const existingQuestion = group.intrebari[i];

            if (this.is_grila) {
              existingQuestion.text_intrebare = generatedQuestion.text_intrebare;
              existingQuestion.raspunsuri = generatedQuestion.raspunsuri || [];
              existingQuestion.raspuns_correct_index = generatedQuestion.raspuns_correct_index || 0;
            } else {
              existingQuestion.text_intrebare = generatedQuestion.text_intrebare;
              existingQuestion.raspunsuri = [];
              existingQuestion.raspuns_correct_index = -1;
            }
          }
        } catch (e) {
          setError(new AiServerError("ErroarePaseJSON", `Error parsing JSON for quiz in section ${nume_materie[i]}. This section will be skipped. Error: ${e}`));
        }
      }
    }
    this.is_computing = false;
  }
  async regenerate(
    nr_intrebari_per_fishier: number,
    materie: string[],
    nume_materie: string[],
    is_grila: boolean,
    models: ModelInfo[],
    baseUrl: string,
    onUpdate: Function,
    config: Config,
    setError: (error: AiServerError) => void
  ) {
    this.is_failed = false;
    await this.genereate(
      nr_intrebari_per_fishier,
      materie,
      nume_materie,
      is_grila,
      models,
      baseUrl,
      onUpdate,
      config,
      setError
    );
  }

  stop(): void {
    if (this.is_computing) {
      console.log("Stopping quiz generation...");
      this.is_computing = false;
    }
  }
}

export class QuiZRequestItem {
  file_nume: string[] = [];
  nr_intrebari_pe_materie: number = 0;
  is_grile: boolean = false;
  title:string
  materie_name:string
  constructor(
    file_nume: string[] = [],
    nr_intrebari_pe_materie: number = 0,
    is_grile: boolean = false,
    title:string="",
    materie_name:string=""
  ) {
    this.file_nume = file_nume;
    this.nr_intrebari_pe_materie = nr_intrebari_pe_materie;
    this.is_grile = is_grile;
    this.title=title
    this.materie_name=materie_name
  }
  getAllMaterieContent(materii: FishierMaterie[]): string[] {
    //todo check
    return this.file_nume
      .map(path => materii.find(mat => mat.path === path)?.sinteza ?? (() => {
        console.warn(`materie ne gasita ${path}`);
        return undefined;
      })())
      .filter((s): s is string => Boolean(s));
  }
}

