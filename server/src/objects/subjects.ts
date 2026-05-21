import { ModelInfo } from "@lmstudio/sdk";
import { Config } from "node-tesseract-ocr";
import { AiServerError } from "./AiTypes.js";
import { extract_text } from "../services/file-processor.js";
import { prompt_sumarizare } from "../ai/prompts.js";
import { get_model } from "../helpers.js";
import { get_compleation } from "../services/llm.js";
import { Quiz } from "./quiz.js";

export class Materie{
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

export class FishierMaterie{
  path:string
  sinteza:string|null=null
  is_computing=false;
  content:string|null=null
  materie:string
  is_failed:boolean=false
  file_type:string|null|undefined=null
  constructor(path:string,materie:string,save:Function,is_first:boolean,config:Config){
    this.path=path;
    this.materie=materie
    if(path.split(".").length==0)
      this.file_type=path.split(".").pop();
    if(this.file_type===undefined)
      this.file_type=null;
    if(is_first)
      extract_text(this.path,config).then((it)=>{
        this.content=it;
      })
  }
  load(save:Function,config:Config){
    extract_text(this.path,config).then((it)=>{
      this.content=it;
    })
  }
  async genereaza_sinteza(models: ModelInfo[], url: string | null, onUpdate: Function,config:Config,setError:(error:AiServerError)=>void) {
    console.log(this.content === null, url === null , this.sinteza != null,this.is_computing);
    if (this.content === null || url === null || this.sinteza != null||this.is_computing) return;
    console.log("generating sinteza");
    this.is_computing = true;
    let prompt = prompt_sumarizare(this.content, this.materie,config.limba);
    let nume_model:string=config.ai_model_sinteza[0].toLowerCase();
    const model_full =  get_model(nume_model,models);
    if (!model_full) {
      let front_end_error_message=new AiServerError("Invalid Model",`Model not found: ${nume_model} not frond on lmstudio server`);
      setError(front_end_error_message)
      console.error(`Model not found: ${nume_model}`);
      this.is_computing = false;
      return;
    }
    try {
      this.sinteza = await get_compleation(
        prompt,
        config.system_prompt,
        ()=>this.is_computing,
        url,
        model_full.path,
        null,
        (s:string)=>{
          this.sinteza=s;
        },
        setError,
        `generare sinteza pentru ${this.path}`,
        config
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
