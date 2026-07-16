import { Config } from "node-tesseract-ocr";
import { get_content_filled_file_list, getDirectoryContent } from "../services/file-processor.js";
import { FishierMaterie, Materie, MaterieImgGroup } from "./subjects.js";
import { AiTextCorectionElement } from "./Evaluation.js";
import { AiServerError } from "./AiTypes.js";
import { AskQuestion } from "./Question.js";
import { GroupIntrebare, Intrebare, Quiz } from "./quiz.js";
import { readFileSync, writeFileSync, statSync } from "fs";
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
      let items: string[] = getDirectoryContent(`${folderPath}/${it}`, []);
      let index: number = this.data.length - 1;
      for (let f of items) {
        const fullPath = `${folderPath}/${it}/${f}`;
        try {
          const stat = statSync(fullPath);
          if (stat.isDirectory()) continue;
        } catch (e) { continue; }
        this.data[index].files.push(
          new FishierMaterie(fullPath, it, this.save, false, config)
        );
      }
      for (let f of items) {
        const fullPath = `${folderPath}/${it}/${f}`;
        try {
          const stat = statSync(fullPath);
          if (!stat.isDirectory()) continue;
          const groupName = f;
          const imgGroup = new MaterieImgGroup(groupName);
          let imageFiles: string[] = getDirectoryContent(fullPath, []);
          for (let img of imageFiles) {
            const imgPath = `${fullPath}/${img}`;
            imgGroup.images.push(
              new FishierMaterie(imgPath, it, this.save, false, config)
            );
          }
          if (imgGroup.images.length > 0) {
            this.data[index].imgs.push(imgGroup);
          }
        } catch (e) { continue; }
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
            // console.log(`[StudyGroup.load] Restored sinteza (${(f.sinteza||"").length} chars) for ${storedFileName}`);
            this.data[index_materie].files[index_fishier].sinteza = f.sinteza;
          }
          if (f.content != null && f.content !== existingSinteza) {
            // console.log(`[StudyGroup.load] Restored content (${(f.content||"").length} chars) for ${storedFileName}`);
            this.data[index_materie].files[index_fishier].content = f.content;
          }
          const existingHtml = this.data[index_materie].files[index_fishier].html_file;
          if (f.html_file != null && f.html_file !== existingHtml) {
            // console.log(`[StudyGroup.load] Restored html_file (${(f.html_file||"").length} chars) for ${storedFileName}`);
            this.data[index_materie].files[index_fishier].html_file = f.html_file;
          }
        }
        let imgGroups: any[] = local.imgs;
        if (imgGroups && Array.isArray(imgGroups)) {
          for (let groupData of imgGroups) {
            let foundGroup = this.data[index_materie].imgs.find((g) => g.title === groupData.title);
            if (!foundGroup) {
              console.warn(`[StudyGroup.load] Could not find image group "${groupData.title}" on disk.`);
              continue;
            }
            let images: FishierMaterie[] = groupData.images;
            for (let imgData of images) {
              let index_img = -1;
              const storedImgName = imgData.path.split('/').pop();
              for (let i = 0; i < foundGroup.images.length; i++) {
                const currentImgName = foundGroup.images[i].path.split('/').pop();
                if (currentImgName === storedImgName) {
                  index_img = i;
                  break;
                }
              }
              if (index_img === -1) {
                console.warn(`[StudyGroup.load] Could not restore data for image ${imgData.path} — no matching file found in group "${groupData.title}".`);
                continue;
              }
              const existingSinteza = foundGroup.images[index_img].sinteza;
              if (imgData.sinteza != null && imgData.sinteza !== existingSinteza) {
                // console.log(`[StudyGroup.load] Restored sinteza (${(imgData.sinteza||"").length} chars) for ${storedImgName} in group "${groupData.title}"`);
                foundGroup.images[index_img].sinteza = imgData.sinteza;
              }
              if (imgData.content != null && imgData.content !== existingSinteza) {
                // console.log(`[StudyGroup.load] Restored content (${(imgData.content||"").length} chars) for ${storedImgName} in group "${groupData.title}"`);
                foundGroup.images[index_img].content = imgData.content;
              }
              const existingHtml = foundGroup.images[index_img].html_file;
              if (imgData.html_file != null && imgData.html_file !== existingHtml) {
                // console.log(`[StudyGroup.load] Restored html_file (${(imgData.html_file||"").length} chars) for ${storedImgName} in group "${groupData.title}"`);
                foundGroup.images[index_img].html_file = imgData.html_file;
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    this.save();
  }
  process_file_delete(name:string){
    if(!name.includes('/')){
      const m_element=this.data.find((it)=>it.imgs.some((g)=>g.title===name))
      if(m_element){
        m_element.imgs=m_element.imgs.filter((g)=>g.title!==name)
        this.save()
        return
      }
    }
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