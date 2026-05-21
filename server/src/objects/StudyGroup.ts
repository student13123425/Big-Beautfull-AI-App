import { Config } from "node-tesseract-ocr";
import { get_content_filled_file_list, getDirectoryContent } from "../services/file-processor.js";
import { FishierMaterie, Materie } from "./subjects.js";
import { AiTextCorectionElement } from "./Evaluation.js";
import { AiServerError } from "./AiTypes.js";
import { AskQuestion } from "./Question.js";
import { GroupIntrebare, Intrebare, Quiz } from "./quiz.js";
import { readFileSync, writeFileSync } from "fs";

export class StudyGroup{
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
  load(config:Config) {
    this.data = [];
    let dirs: string[] = getDirectoryContent("./data");
    for (let it of dirs) {
      this.data.push(new Materie(it));
      let files: string[] = getDirectoryContent(`./data/${it}`);
      let index: number = this.data.length - 1;
      for (let f of files) {
        let path:string=`./data/${it}/${f}`;
        let filled=get_content_filled_file_list()
        this.data[index].files.push(
          new FishierMaterie(path, it, this.save,!filled.includes(path),config)
        );
      }
    }
    try {
      let json: string = readFileSync("./StudyGroups.json", "utf-8");
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
          let content:string|null=f.content
          this.data[index_materie].files[index_fishier].sinteza = sinteza;
          this.data[index_materie].files[index_fishier].content = content;
        }
      }
    } catch (e) {
      console.log(e);
    }
    this.save();
  }
  process_file_delete(name:string){
    const parts = name.split('/');
    const filename = parts[parts.length - 1];
    const materie = parts.length >= 3 ? parts[parts.length - 2] : '';
    const m_element=this.data.find((it)=>it.name===materie)
    if(m_element){
      m_element.files=m_element.files.filter((it)=>it.path.split('/')[it.path.split('/').length-1]!==filename)
    }
  }
  save(){
    let json:string=JSON.stringify(this);
    writeFileSync(this.file_path,json,"utf-8");
  }
}