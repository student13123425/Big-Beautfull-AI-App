import { ModelInfo } from "@lmstudio/sdk";
import { get_question_prompt } from "../ai/prompts.js";
import { get_compleation } from "../services/llm.js";
import { AiServerError } from "./AiTypes.js";
import { Config } from "node-tesseract-ocr";

export class AskQuestion{
  content:string|null=null
  is_computing=false;
  is_failed:boolean=false
  async askQuestion(models: ModelInfo[],url:string,materieName:string,file_content:string,question:string,quality:number,config:Config,setError:(e:AiServerError)=>void){
    if(this.is_computing)
      return
    console.log("url:"+url);
    this.is_computing=true;
    this.content=null;
    const prompt:string=get_question_prompt(materieName,file_content,question,config.limba);
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
        `answering question for this document`,
        config,
      );
    this.is_computing=false;
  }
  stop(){
    this.content=null;
    this.is_computing=false
  }
}

