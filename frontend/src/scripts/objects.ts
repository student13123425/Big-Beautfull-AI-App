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

export class Materie {
  name: string;
  quizs: Quiz[] = [];
  files: FishierMaterie[] = [];
  imageGroups: ImageGroup[] = [];

  constructor(name: string) {
    this.name = name;
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
  system_prompt: string;
  limba: string;

  constructor(
    model_token_limit: number = 1024 * 32,
    system_prompt: string = "You are ChatGPT, a helpful AI assistant.",
    limba: string = "romana"
  ) {
    this.model_token_limit = model_token_limit;
    this.system_prompt = system_prompt;
    this.limba = limba;
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

    if (typeof obj.system_prompt === "string") {
      this.system_prompt = obj.system_prompt;
    } else if (typeof obj.system_propmt === "string") {
      this.system_prompt = obj.system_propmt;
    } else {
      isValid = false;
      console.warn("Invalid system_prompt, using default");
    }

    if (typeof obj.limba === "string") {
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


export {FishierMaterie,Intrebare,Quiz,StudyGroup}


export class Image {
  path: string;
  text: string;

  constructor(path: string, text: string) {
    this.path = path;
    this.text = text;
  }
}

export class ImageGroup {
  title: string;
  images: Image[];

  constructor(title: string, images?: Image[]) {
    this.title = title ?? '';
    this.images = images || [];
  }

  addImage(image: Image): void {
    this.images.push(image);
  }

  removeImageAt(index: number): Image | null {
    if (index < 0 || index >= this.images.length) return null;
    return this.images.splice(index, 1)[0];
  }
}



