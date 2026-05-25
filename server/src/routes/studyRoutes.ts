import { Request, Response } from "express";
import { mkdir, mkdirSync, rmSync } from "fs";
import { broadcastStudyData, config} from "../index.js";
import { get_file_name, getDirectoryContent } from "../services/file-processor.js";
import { ai_models_available, data_study, device_ip, htmlStyles } from "../services/state.js";
import { AiServerError } from "../objects/AiTypes.js";

export async function addMaterie(req: Request, res: Response): Promise<void> {
  if (!req.body.name) {
    res.send("n");
    return;
  }
  
  const name: string = req.body.name;
  const list: string[] = getDirectoryContent("./data/");
  
  if (list.map((it) => it.toLowerCase()).includes(name.toLowerCase())) {
    let front_end_error_message = new AiServerError(`materia deja exista`, `materia ${name.toLowerCase()} deja exista in system`, true);
    data_study.AiServerError.push(front_end_error_message);
    res.send("n");
  } else {
    await mkdirSync(`./data/${name}`, { recursive: true });
    data_study.load(config);
    broadcastStudyData();
    res.send("y");
  }
}

export async function deleteMaterie(req: Request, res: Response): Promise<void> {
  if (!req.body.name) {
    res.send("n");
    return;
  }
  
  const name: string = req.body.name;
  const list: string[] = getDirectoryContent("./data/");
  
  if (list.map((it) => it.toLowerCase()).includes(name.toLowerCase())) {
    await rmSync(`./data/${name}`, { recursive: true, force: true });
    data_study.load(config);
    broadcastStudyData();
    res.send("y");
  } else {
    let front_end_error_message = new AiServerError(`materia nu exista`, `materia ${name.toLowerCase()} nu exista in system`, true);
    data_study.AiServerError.push(front_end_error_message);
    res.send("n");
  }
}

export async function getStudy(req: Request, res: Response): Promise<void> {
  res.json(data_study);
}

export async function regenereazSinteza(req: Request, res: Response){
    if (!req.body.name_materie || !req.body.file_name) {
      res.send("n");
      return;
    }
    const name_materie: string = req.body.name_materie;
    const file_name: string = req.body.file_name;
    
    for (let it of data_study.data) {
      if (it.name === name_materie) {
        for (let j of it.files) {
          let name: string = get_file_name(j.path);
          if (name === file_name) {
            j.regenerate_sinteza(ai_models_available, device_ip, () => {
              data_study.save();
              broadcastStudyData();
            }, config,
            (error:AiServerError)=>{
              j.is_computing=false;
              j.sinteza=null
              data_study.AiServerError.push(error);
              broadcastStudyData();
            }
            ).then(()=>{
              data_study.save();
              broadcastStudyData();
            });
            res.send("y");
            return;
          }
        }
      }
    }
    const error:AiServerError=new AiServerError(`parametri invalizi sinteza`,`errorare generare sinteza datele name_materie:${name_materie} file_name:${file_name} sunt invalide`)
    data_study.AiServerError.push(error);
    broadcastStudyData();
    res.send("n");
}

export async function genereazSinteza(req: Request, res: Response){
   if (!req.body.name_materie || !req.body.file_name) {
     res.send("n");
     return;
   }
   const name_materie: string = req.body.name_materie;
   const file_name: string = req.body.file_name;
   for (let it of data_study.data) {
     if (it.name === name_materie) {
       for (let j of it.files) {
         let name: string = get_file_name(j.path);
         if (name === file_name) {
           j.genereaza_sinteza(ai_models_available, device_ip, () => {
             data_study.save();
             broadcastStudyData();
           }, config,
           (error:AiServerError)=>{
             j.is_computing=false;
             j.sinteza=null;
             data_study.AiServerError.push(error);
             broadcastStudyData();
           }
           ).then(()=>{
             data_study.save();
             broadcastStudyData();
           });
           res.send("y");
           return;
         }
       }
     }
   }
   const error:AiServerError=new AiServerError(`parametri invalizi sinteza`,`errorare generare sinteza datele name_materie:${name_materie} file_name:${file_name} sunt invalide`)
   data_study.AiServerError.push(error);
   broadcastStudyData();
   res.send("n");
}

export function getSintezaHtmlPosilbleStyles(req: Request, res: Response){
  res.send(htmlStyles);
}