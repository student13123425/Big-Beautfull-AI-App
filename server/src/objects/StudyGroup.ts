import { Config } from "node-tesseract-ocr";
import { get_content_filled_file_list, getDirectoryContent } from "../services/file-processor.js";
import { FishierMaterie, Materie } from "./subjects.js";
import { AiTextCorectionElement } from "./Evaluation.js";
import { AiServerError } from "./AiTypes.js";
import { AskQuestion } from "./Question.js";
import { GroupIntrebare, Intrebare, Quiz } from "./quiz.js";
import { readFileSync, writeFileSync } from "fs";
import { getUserFolderPath, getUserMetaDataSpot } from "../routes/auth.js";

export class StudyGroup{
  data:Materie[]=[]
  private _userId: string | undefined;
  file_path:string;
  AiTextCorrection:AiTextCorectionElement=new AiTextCorectionElement(new Quiz(),[])
  AiServerError:AiServerError[]=[];
  CurrentAskedQuestion:AskQuestion=new AskQuestion();
  constructor(userId?: string) {
    this._userId = userId;
    this.file_path = getUserMetaDataSpot(this._userId);
  }

  setUserId(userId: string | undefined): void {
    this._userId = userId;
    this.file_path = getUserMetaDataSpot(this._userId);
  }
  get_is_computing(): boolean {
    return this.data.some((it)=>it.get_is_computing());
  }
  load(config:Config) {
    this._loadWithUserId(config, this._userId);
  }

  private _loadWithUserId(config: Config, userId: string | undefined): void {
    this.data = [];
    const folderPath = getUserFolderPath(userId);
    let dirs: string[] = getDirectoryContent(folderPath, ["temp_uploads", "UserMetadata"]);
    for (let it of dirs) {
      this.data.push(new Materie(it));
      let files: string[] = getDirectoryContent(`${folderPath}/${it}`, []);
      let index: number = this.data.length - 1;
      for (let f of files) {
        let path:string=`${folderPath}/${it}/${f}`;
        let filled=get_content_filled_file_list()
        this.data[index].files.push(
          new FishierMaterie(path, it, this.save,false,config)
        );
      }
    }
    try {
      let json: string = readFileSync(this.file_path, "utf-8");
      let data: StudyGroup | any = JSON.parse(json);
      if (typeof data !== "object" || data === null) {
        throw Error("invalid data in " + this.file_path);
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
          // Match by filename (last path segment) instead of full absolute path,
          // because paths can differ between restarts if the home directory
          // resolution changes (symlinks, mounts, etc.).
          const storedFileName = f.path.split('/').pop();
          for (let i = 0; i < this.data[index_materie].files.length; i++) {
            const currentFileName = this.data[index_materie].files[i].path.split('/').pop();
            if (currentFileName === storedFileName) {
              index_fishier = i;
              break;
            }
          }
          if (index_fishier === -1) {
            console.warn(`[StudyGroup.load] Could not restore sinteza for file ${f.path} — no matching file found on disk.`);
            continue;
          }
          const existingSinteza = this.data[index_materie].files[index_fishier].sinteza;
          if (f.sinteza != null && f.sinteza !== existingSinteza) {
            console.log(`[StudyGroup.load] Restored sinteza (${(f.sinteza||"").length} chars) for ${storedFileName}`);
            this.data[index_materie].files[index_fishier].sinteza = f.sinteza;
          }
          if (f.content != null && f.content !== existingSinteza) {
            console.log(`[StudyGroup.load] Restored content (${(f.content||"").length} chars) for ${storedFileName}`);
            this.data[index_materie].files[index_fishier].content = f.content;
          }
          const existingHtml = this.data[index_materie].files[index_fishier].html_file;
          if (f.html_file != null && f.html_file !== existingHtml) {
            console.log(`[StudyGroup.load] Restored html_file (${(f.html_file||"").length} chars) for ${storedFileName}`);
            this.data[index_materie].files[index_fishier].html_file = f.html_file;
          }
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