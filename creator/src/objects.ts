import { ModelInfo } from "@lmstudio/sdk"
import fs from "fs"
import { extract_text, generate_quiz_json_prompt, get_compleation, get_json_from_text, get_model, get_question_prompt, getDirectoryContent, getSupportedLanguages, is_file_image, prompt_sumarizare, promptEvaluareIntrebare } from "./aox.js";
class Config {
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
      "lmstudio-community/Qwen3-30B-A3B-GGUF/Qwen3-30B-A3B-Q3_K_L.gguf", 
      "lmstudio-community/Qwen3-30B-A3B-GGUF/Qwen3-30B-A3B-Q3_K_L.gguf"
    ],
    ai_model_question: string[] = [
      "deepseek/deepseek-r1-0528-qwen3-8b",
      "lmstudio-community/Qwen3-14B-GGUF/Qwen3-14B-Q4_K_M.gguf",
      "lmstudio-community/Qwen3-30B-A3B-GGUF/Qwen3-30B-A3B-Q3_K_L.gguf"
    ],
    ai_model_quiz: string[] = [
      "lmstudio-community/Qwen3-30B-A3B-GGUF/Qwen3-30B-A3B-Q3_K_L.gguf",
      "lmstudio-community/Qwen3-30B-A3B-GGUF/Qwen3-30B-A3B-Q3_K_L.gguf"
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
      if (!fs.existsSync(path)) {
        console.warn("Config file not found, saving default configuration");
        this.save(path);
        return;
      }

      const file = fs.readFileSync(path, "utf-8");
      const configData = JSON.parse(file);
      
      // Load all properties with validation
      this.loadFrom(configData);
      
    } catch (err) {
      console.error("Failed to load config:", err);
      this.save(path); // Save default config on error
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
    if (typeof obj.limba === "string"&&getSupportedLanguages().includes(obj.limba)) {
      this.limba = obj.limba;
    } else {
      isValid = false;
      console.warn("Invalid language setting, using default");
    }
    
    return isValid;
  }

  save(path: string = "./config.json"): void {
    try {
      const configData = {
        model_token_limit: this.model_token_limit,
        ip: this.ip,
        ai_model_sinteza: this.ai_model_sinteza,
        ai_model_question: this.ai_model_question,
        ai_model_quiz: this.ai_model_quiz, // Added missing property
        system_prompt: this.system_prompt,
        limba: this.limba  // Added missing property
      };
      
      fs.writeFileSync(
        path, 
        JSON.stringify(configData, null, 2), 
        "utf-8"
      );
      console.log("Config saved successfully to:", path);
    } catch (err) {
      console.error("Failed to save config:", err);
    }
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

class Intrebare{
  id:number=-1
  raspunsuri:string[]=[]
  text_intrebare:string=""
  raspuns_correct_index:number=-1
  is_failed:boolean=false
  constructor(){
    
  }
}

class GroupIntrebare{
  title:string=""
  intrebari:Intrebare[]=[]
}

class Quiz{
  intrebari:GroupIntrebare[]=[]
  is_grila:boolean=false
  is_computing:boolean=false
  title:string=""
  is_failed:boolean=false
  constructor(){

  }
  async genereate(nr_intrebari_per_fishier:number,materie:string[],nume_materie:string[],is_grila:boolean,models:ModelInfo[],baseUrl:string,onUpdate:Function,config:Config,setError:(error:AiServerError)=>void){
    this.is_computing=true;
    this.is_grila=is_grila;
    let c=0;
    for(let i in nume_materie){
      const format: string = is_grila
        ? `[
            {
              "text_intrebare": "Question text?",
              "raspunsuri": ["Option A", "Option B", "Option C", "Option D"],
              "raspuns_correct_index": 0
            }
          ]`
        : `[
            {
              "text_intrebare": "Question text?"
            }
          ]`;
      let prompt:string=generate_quiz_json_prompt(nume_materie[i],materie[i],nr_intrebari_per_fishier,is_grila,format,"intrebari pt un quiz la aceasta materie");
      let  output:string|null=await get_compleation(prompt,config.system_prompt,()=>{return this.is_computing},baseUrl,config.ai_model_quiz[0],null,(s:string)=>{},setError,`generare quiz la ${nume_materie[i]}`)
        if(output){
          try{
            let data:Intrebare[]=JSON.parse(get_json_from_text(output))
            let group=new GroupIntrebare()
            group.title=nume_materie[i]
            for(let it of data){
              let newItem:Intrebare=new Intrebare()
              if(this.is_grila){
                newItem.id=c;
                newItem.raspuns_correct_index=it.raspuns_correct_index
                newItem.raspunsuri=it.raspunsuri
                newItem.text_intrebare=it.text_intrebare
              }else{
                newItem.id=c;
                newItem.text_intrebare=it.text_intrebare
              }
              c+=1
              group.intrebari.push(newItem);
            }
            this.intrebari.push(group)
          }catch(e){
            setError(new AiServerError("ErroarePaseJSON",`erare la parse json pentru generare quiz la sectiunea ${nume_materie[i]} this section will be skiped Error:${e}` ))
          }
        }
    }
    this.is_computing=false
  }
  stop(): void {
    if (this.is_computing) {
      console.log('Stopping quiz generation...');
      this.is_computing = false;
    }
  }
}

class FishierMaterie{
  path:string
  sinteza:string|null=null
  is_computing=false;
  content:string|null=null
  materie:string
  is_failed:boolean=false
  file_type:string|null|undefined=null
  constructor(path:string,materie:string,save:Function){
    this.path=path;
    this.materie=materie
    if(path.split(".").length==0)
      this.file_type=path.split(".").pop();
    if(this.file_type===undefined)
      this.file_type=null;
    extract_text(this.path).then((it)=>{
      this.content=it;
    })
    console.log(this.content);
  }
  load(save:Function){
    extract_text(this.path).then((it)=>{
      this.content=it;
    })
  }
  async genereaza_sinteza(models: ModelInfo[], url: string | null, onUpdate: Function,config:Config,setError:(error:AiServerError)=>void) {
    console.log(this.content === null, url === null , this.sinteza != null,this.is_computing);
    if (this.content === null || url === null || this.sinteza != null||this.is_computing) return;
    console.log("generating sinteza");
    this.is_computing = true;
    let prompt = prompt_sumarizare(this.content, this.materie);
    let nume_model:string=config.ai_model_sinteza[0].toLowerCase();
    const is_img:boolean=is_file_image(this.path);
    if(is_img){
      nume_model=config.ai_model_sinteza[1].toLowerCase();
      prompt=prompt_extrage_text_img(this.materie);
    }
    const model_full =  get_model(nume_model,models);
    if (!model_full) {
      let front_end_error_message=new AiServerError("Invalid Model",`Model not found: ${nume_model} not frond on lmstudio server`);
      setError(front_end_error_message)
      console.error(`Model not found: ${nume_model}`);
      this.is_computing = false;
      return;
    }
    const img=is_img?this.path:null;
    try {
      this.sinteza = await get_compleation(
        prompt,
        config.system_prompt,
        ()=>this.is_computing,
        url,
        model_full.path,
        img,
        (s:string)=>{
          this.sinteza=s;
        },
        setError,
        `generare sinteza pentru ${this.path}`
      );
      onUpdate();
    }catch(e){
      let front_end_error_message=new AiServerError("Eroare generare sinteza",`Erroare generare sinteza pentru ${this.path} useing model ${nume_model}`);
      setError(front_end_error_message)
      console.log("Error "+e);
    } finally {
      this.is_computing = false;
    }
  }
  async regenerate_sinteza(models:ModelInfo[],url:string|null,onUpdate:Function,config:Config,setError:(error:AiServerError)=>void){
    this.sinteza=null;
    this.genereaza_sinteza(models,url,onUpdate,config,setError);
  }
  stopGeneratingSinteza(): void {
    if (this.is_computing) {``
      console.log('Stopping sinteza generation...');
      this.is_computing = false;
    }
  }
}

class Materie{
  name:string
  quizs:Quiz[]=[]
  files:FishierMaterie[]=[]
  constructor(name:string){
    this.name=name
  }
  async generate_sinteza_all_files(
    models: ModelInfo[], 
    url: string | null, 
    config: Config,
    setError: (error: AiServerError) => void
  ) {
    const promises = this.files.map(it => new Promise<void>((resolve) => {
      it.genereaza_sinteza(
        models,
        url,
        (s: string) => { it.sinteza = s; },  // Preserve update callback
        config,
        (e: AiServerError) => {
          setError(e);                       // Preserve error handling
          it.sinteza = null;
          it.is_computing = false;
          resolve();                         // Resolve even on error
        }
      );
  }));
  await Promise.all(promises);  // Wait for all operations to complete
}
  get_is_computing(): boolean {
    return this.files.some(file => 
      file.is_computing || 
      this.quizs.some(quiz => quiz.is_computing)
    );
  }
}

class AskQuestion{
  content:string|null=null
  is_computing=false;
  is_failed:boolean=false
  async askQuestion(models: ModelInfo[],url:string,materieName:string,file_content:string,question:string,quality:number,config:Config,setError:(e:AiServerError)=>void){
    if(this.is_computing)
      return
    console.log("url:"+url);
    this.is_computing=true;
    this.content=null;
    const prompt:string=get_question_prompt(materieName,file_content,question);
    const model_name:string=config.ai_model_question[quality]
    let model_full=models.find((it)=>it.path===model_name);
    if(!model_full){
      this.is_computing=false;
      setError(new AiServerError("model not found","the selected model for answering this question is not found model: "+model_name))
      console.log("model negasit");
      return;
    }
    this.content = await get_compleation(
        prompt,
        config.system_prompt,
        ()=>this.is_computing,
        url,
        model_full.path,
        null,
        (s:string)=>{
          this.content=s;
        },
        setError,
        `answering question for this document`
      );
    this.is_computing=false;
  }
  stop(){
    this.content=null;
    this.is_computing=false
  }
}

class StudyGroup{
  data:Materie[]=[]
  file_path:string="./StudyGroups.json"
  AiTextCorrection:AiTextCorectionElement=new AiTextCorectionElement(new Quiz(),[])
  AiServerError:AiServerError[]=[];
  CurrentAskedQuestion:AskQuestion=new AskQuestion();
  constructor(){

  }
  get_is_computing(): boolean {
    return this.data.some((it)=>it.get_is_computing());
  }
  load() {
    this.data = [];
    let dirs: string[] = getDirectoryContent("./data");
    for (let it of dirs) {
      this.data.push(new Materie(it));
      let files: string[] = getDirectoryContent(`./data/${it}`);
      let index: number = this.data.length - 1;
      for (let f of files) {
        this.data[index].files.push(
          new FishierMaterie(`./data/${it}/${f}`, it, this.save)
        );
      }
    }
    try {
      let json: string = fs.readFileSync("./StudyGroups.json", "utf-8");
      let data: StudyGroup | any = JSON.parse(json);
      if (typeof data !== "object" || data === null) {
        throw Error("invalid data in ./StudyGroups.json");
      }
      for (let it of data.data) {
        let local: Materie = it;
        let index_materie = -1;
        for (let i = 0; i < this.data.length; i++)
          if (this.data[i].name === local.name) index_materie = i;
        if (index_materie === -1) continue;
        if (local.quizs && Array.isArray(local.quizs)) {
          this.data[index_materie].quizs = [];
          for (let quiz of local.quizs) {
            let newQuiz = new Quiz();
            newQuiz.title=quiz.title
            newQuiz.is_grila = !!quiz.is_grila;
            if (quiz.intrebari && Array.isArray(quiz.intrebari)) {
              for (let groupData of quiz.intrebari) {
                let group = new GroupIntrebare();
                if (typeof groupData.title === "string") {
                  group.title = groupData.title;
                }
                if (groupData.intrebari && Array.isArray(groupData.intrebari)) {
                  for (let intrebData of groupData.intrebari) {
                    let intreb = new Intrebare();
                    intreb.id = intrebData.id ?? -1;
                    intreb.text_intrebare = intrebData.text_intrebare || "";
                    
                    if (Array.isArray(intrebData.raspunsuri)) {
                      intreb.raspunsuri = intrebData.raspunsuri.filter(
                        (r: any) => typeof r === "string"
                      );
                    }
                    
                    intreb.raspuns_correct_index = 
                      intrebData.raspuns_correct_index ?? -1;
                    
                    intreb.is_failed = !!intrebData.is_failed;
                    
                    group.intrebari.push(intreb);
                  }
                }
                
                newQuiz.intrebari.push(group);
              }
            }
            this.data[index_materie].quizs.push(newQuiz);
          }
        }
        let files: FishierMaterie[] = local.files;
        for (let f of files) {
          let index_fishier = -1;
          for (let i = 0; i < this.data[index_materie].files.length; i++)
            if (
              this.data[index_materie].files[i].path === f.path
            )
              index_fishier = i;
          if (index_fishier === -1) continue;
          let sinteza: string | null = f.sinteza;
          this.data[index_materie].files[index_fishier].sinteza = sinteza;
        }
      }
    } catch (e) {
      console.log(e);
    }
    this.save();
  }
  save(){
    let json:string=JSON.stringify(this);
    fs.writeFileSync(this.file_path,json,"utf-8");
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

export class AiServerError {
  title: string | null;
  content: string | null;
  active: boolean;

  constructor(
    title: string | null = null,  
    content: string | null = null,
    active: boolean = true
  ) {
    this.title = title;
    this.content = content;
    this.active = active;
  }
}

export {StudyGroup,FishierMaterie,Quiz,Intrebare,Global,Config}

export class AiTextCorectionGroup{
  title:string
  data:AiTextCorection[]=[]
  evaluare_all(materie_name:string,limba:string,setError:(error: AiServerError) => void,config:Config,url:string){
    for(let it of this.data)
      it.evaluare(materie_name,limba,setError,config,url,0)
  }
  constructor(title:string,group:GroupIntrebare,raspunsuri:string[],start_index:number){
    this.title=title
    this.data=group.intrebari.map((it,i)=>(new AiTextCorection(it.text_intrebare,raspunsuri[start_index+i])))
  }
}

export class AiTextCorectionElement{
  data:AiTextCorectionGroup[]=[]
    evaluare_all(materie_name:string,limba:string,setError:(error: AiServerError) => void,config:Config,url:string){
      for(let it of this.data)
        it.evaluare_all(materie_name,limba,setError,config,url)
    }
    get_is_computiong():boolean{
      return this.data.some((it)=>it.data.some((j)=>j.is_computing))
    }
  constructor(quiz:Quiz,answers:string[]){
    let count=0
    this.data=quiz.intrebari.map((it)=>{
      let item=new AiTextCorectionGroup(it.title,it,answers,count)
      count+=it.intrebari.length;
      return item
    })
  }
}

interface AiTextCorectionData {
  detailed_markdown: string;
  score:number
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
  async evaluare(materie_name:string,limba:string,setError:(error: AiServerError) => void,config:Config,url:string,depth:number):Promise<boolean>{
    if(depth>5){
      return false
    }
    this.is_computing=true
    const prompt:string=promptEvaluareIntrebare(this.cerinta_initiala,this.raspuns_intrebare,materie_name,limba)
    if(materie_name.length===0||this.cerinta_initiala.length===0||this.raspuns_intrebare.length===0){
      setError(new AiServerError("invalid","date de input pt evaluarea intrebari invalide"));
      return false
    }
    const text:string|null=await get_compleation(prompt,config.system_prompt,()=>{
      return this.is_computing
    },url,config.ai_model_sinteza[0],null,(it:string)=>{
    },setError,"generare evaluare")
    if(text==null){
      return this.evaluare(materie_name,limba,setError,config,url,depth+1)
    }
    try{
      const data:AiTextCorectionData=JSON.parse(text)
      this.detailed_markdown=data.detailed_markdown
      this.score=data.score
    }catch(e){
      return this.evaluare(materie_name,limba,setError,config,url,depth+1)
    }
    this.is_computing=false
    return true;
  }
  stop(){
    this.is_computing=false
  }
}

function prompt_extrage_text_img(materie: string): string {
  throw new Error("Function not implemented.")
}
