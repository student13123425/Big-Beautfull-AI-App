class Intrebare{
  id:number=-1
  raspunsuri:string[]=[]
  text_intrebare:string=""
  raspuns_correct_index:number=-1
  is_failed:boolean=false
  constructor(){
    
  }
}

export class GroupIntrebare{
  title:string=""
  intrebari:Intrebare[]=[]
}

class Quiz{
  intrebari:GroupIntrebare[]=[]
  is_grila:boolean=false
  is_computing:boolean=false
  title:string=""
  constructor(){

  }
  stop(): void {
    //todo
  }
}
class FishierMaterie{
  path:string=""
  sinteza:string|null=null
  html_file:string|null=null
  is_computing=false;
  content:string|null=null
  materie:string=""
  is_failed:boolean=false
  file_type:string|null|undefined=null
  constructor(path:string,materie:string,save:Function){

  }
}

class Materie{
  name:string
  quizs:Quiz[]=[]
  files:FishierMaterie[]=[]
  constructor(name:string){
    this.name=name
  }
  get_is_computing(): boolean {
    return this.files.some(file => 
      file.is_computing || 
      this.quizs.some(quiz => quiz.is_computing)
    );
  }
}

export class AiServerError{
  title:string|null=null
  content:string|null=null
  active:boolean=false
}

export function compareStudyGroup(a: any, b: any): boolean {
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


class StudyGroup{
  data:Materie[]=[]
  file_path:string="./StudyGroups.json"
  CurrentAskedQuestion:AskQuestion=new AskQuestion();
  AiServerError:AiServerError[]=[];
  AiTextCorrection:AiTextCorectionElement=new AiTextCorectionElement(new Quiz(),[])
  constructor(){
    
  }
  get_is_computing(): boolean {
    return this.data.some((it)=>it.get_is_computing());
  }
}

export class FileD{
  nume:string
  tip:string
  constructor(  nume:string,tip:string){
    this.nume=nume
    this.tip=tip
  }
}

export class AskQuestion{
  content:string|null=null
  is_computing=false;
}

export function get_matery_list(sg:StudyGroup):string[]{
  return sg.data.map(it=>it.name);
}

export class Config {
  model_token_limit: number;
  ip: string | null;
  ai_model_sinteza: string[];
  ai_model_question: string[];
  ai_model_quiz: string[];
  system_prompt: string;
  limba: string;

  constructor(
    model_token_limit: number = 1024 * 32, // 32k tokens
    ip: string | null = null,
    ai_model_sinteza: string[] = [
      "lmstudio-community/Qwen3-14B-GGUF/Qwen3-14B-Q4_K_M.gguf", 
      "lmstudio-community/gemma-3-27b-it-GGUF/gemma-3-27b-it-Q3_K_L.gguf"
    ],
    ai_model_question: string[] = [
      "microsoft/phi-4-mini-reasoning",
      "deepseek/deepseek-r1-0528-qwen3-8b",
      "lmstudio-community/Qwen3-14B-GGUF/Qwen3-14B-Q4_K_M.gguf"
    ],
    ai_model_quiz: string[] = [
      "lmstudio-community/gemma-3-27b-it-GGUF/gemma-3-27b-it-Q3_K_L.gguf",
      "lmstudio-community/gemma-3-27b-it-GGUF/gemma-3-27b-it-Q3_K_L.gguf"
    ],
    system_prompt: string = "You are ChatGPT, a helpful AI assistant.",
    limba: string = "romana"
  ) {
    this.model_token_limit = model_token_limit;
    this.ip = ip;
    this.ai_model_sinteza = ai_model_sinteza;
    this.ai_model_question = ai_model_question;
    this.ai_model_quiz = ai_model_quiz;
    this.system_prompt = system_prompt;
    this.limba = limba;
  }

  loadFrom(obj: any): boolean {
    if (!obj) return false;
    
    let isValid = true;
    
    // Validate and load each property
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
    
    // Handle system_prompt with backward compatibility
    if (typeof obj.system_prompt === "string") {
      this.system_prompt = obj.system_prompt;
    } 
    else if (typeof obj.system_propmt === "string") { // Handle old typo
      this.system_prompt = obj.system_propmt;
    }
    else {
      isValid = false;
      console.warn("Invalid system_prompt, using default");
    }
    
    // Load language setting
    if (typeof obj.limba === "string") {
      this.limba = obj.limba;
    } else {
      isValid = false;
      console.warn("Invalid language setting, using default");
    }
    
    return isValid;
  }

  // Helper method for debugging
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

export class AiModel {
  path: string;
  name: string;
  number_of_parameters: string;
  max_content_length:number
  is_image_support: boolean;
  estimated_vram_usage: number;
  constructor(
    path: string,
    name: string,
    number_of_parameters: string,
    max_content_length:number,
    estimated_vram_usage: number, 
    is_image_support: boolean=false,
  ) {
    this.path = path;
    this.name = name;
    this.number_of_parameters = number_of_parameters;
    this.is_image_support = is_image_support;
    this.estimated_vram_usage = estimated_vram_usage;
    this.max_content_length=max_content_length
  }
}

export class AiTextCorectionGroup{
  title:string
  data:AiTextCorection[]=[]
  constructor(title:string,group:GroupIntrebare,raspunsuri:string[],start_index:number){
    this.title=title
    this.data=group.intrebari.map((it,i)=>(new AiTextCorection(it.text_intrebare,raspunsuri[start_index+i])))
  }
}

export class AiTextCorectionElement{
  data:AiTextCorectionGroup[]=[]
  constructor(quiz:Quiz|null,answers:string[]){
    if(quiz==null){
      this.data=[];
      return;
    }
    let count=0
    this.data=quiz.intrebari.map((it)=>{
      let item=new AiTextCorectionGroup(it.title,it,answers,count)
      count+=it.intrebari.length;
      return item
    })
  }
}

export class AiTextCorection{
  score:number
  detailed_markdown:string
  cerinta_initiala:string
  raspuns_intrebare:string
  is_computing:boolean
  constructor(
    cerintaInitiala: string,
    raspuns_intrebare:string
  ) {
    this.score = 0;
    this.detailed_markdown = "";
    this.cerinta_initiala = cerintaInitiala;
    this.raspuns_intrebare=raspuns_intrebare
    this.is_computing=false
  }
}



export interface StyleConfig {
  name: string;
  description?: string;
  layout?: { 
    containerMaxWidth?: string | number; 
    gridTemplate?: string; 
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'; 
    gap?: string; 
    padding?: string; 
    alignment?: 'start' | 'center' | 'end' | 'stretch'; 
  };
  typography?: { 
    fontFamily: string[]; 
    baseFontSize?: string; 
    headingSizes?: Record<string, string>; 
    lineHeight?: number; 
    letterSpacing?: string; 
    weightScale?: Record<string, number>; 
  };
  colors?: { 
    background: string; 
    surface?: string; 
    text: string; 
    primary: string; 
    secondary?: string; 
    accent?: string[]; 
    darkMode?: Partial<StyleConfig['colors']>; 
  };
  effects?: { 
    borderRadius?: string; 
    boxShadow?: string | string[]; 
    border?: string; 
    backdropBlur?: string; 
    opacity?: number; 
    animations?: Record<string, { duration?: string; easing?: string; keyframes?: string }>; 
    hoverTransform?: string; 
  };
  components?: { 
    cards?: Partial<StyleConfig['effects'] & { padding?: string; background?: string }>; 
    tables?: { headerBg?: string; rowHover?: boolean; striped?: boolean; borderStyle?: 'solid' | 'dashed' | 'none' }; 
    lists?: { bulletStyle?: 'disc' | 'square' | 'none'; icon?: string }; 
    callouts?: { borderLeftWidth?: string; borderColor?: string; background?: string }; 
    badges?: { padding?: string; borderRadius?: string; fontSize?: string }; 
  };
  interactivity?: { 
    hoverEffects?: boolean; 
    scrollReveal?: boolean; 
    themeToggle?: boolean; 
    collapsibleSections?: boolean; 
    transitionDuration?: string; 
  };
  responsive?: { 
    breakpoints?: Record<string, Partial<StyleConfig>>; 
    fluidTypography?: boolean; 
  };
  print?: { 
    pageSize?: 'A4' | 'Letter'; 
    margins?: string; 
    colorAdjust?: 'exact' | 'auto'; 
    pageBreaks?: boolean 
  };
  accessibility?: { 
    contrastRatio?: number; 
    focusVisible?: boolean; 
    reducedMotion?: boolean 
  };
  cssVariables?: Record<string, string>;
}


export type StyleBundle = { 
  base: StyleConfig; 
  variants?: { dark?: Partial<StyleConfig>; print?: Partial<StyleConfig>; mobile?: Partial<StyleConfig> }; 
};


export class StyleConfigList {
  private styles: StyleBundle[];

  constructor(items:StyleConfigList) {
    try {
      if (!Array.isArray(items.styles)) throw new Error('Failed to load styles from the json provided by the api');
      this.styles = items.styles as StyleBundle[];
    } catch (error: any) {
      console.error(`Failed to load styles from the json provided by the api:`, error.message);
      throw error;
    }
  }

  getStyles(): StyleBundle[] { 
    return [...this.styles]; 
  }

  getStyleByName(name: string): StyleBundle | undefined { 
    return this.styles.find(s => s.base.name === name); 
  }
}


export {FishierMaterie,Intrebare,Materie,Quiz,StudyGroup}
