import { Config } from "node-tesseract-ocr"
import { AiServerError, AiTextCorectionData } from "./AiTypes.js"
import { GroupIntrebare, Quiz } from "./quiz.js"
import { promptEvaluareIntrebare } from "../ai/prompts.js"
import { get_compleation } from "../services/llm.js"

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
  async evaluare(materie_name:string,limba:string,setError:(error: AiServerError) => void,config:Config,url:string,depth:number):Promise<boolean>{
    if(depth>5){
      return false
    }
    this.is_computing=true
    const prompt:string=promptEvaluareIntrebare(this.cerinta_initiala,this.raspuns_intrebare,materie_name,limba)
    if (!materie_name || !this.cerinta_initiala || !this.raspuns_intrebare ||
        materie_name.length === 0 || this.cerinta_initiala.length === 0 || this.raspuns_intrebare.length === 0) {
      setError(new AiServerError("invalid","date de input pt evaluarea intrebari invalide"));
      return false;
    }
    const text:string|null=await get_compleation(prompt,config.system_prompt,()=>{
      return this.is_computing
    },url,config.ai_model_sinteza[0],null,(it:string)=>{
    },setError,"generare evaluare",config)
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
