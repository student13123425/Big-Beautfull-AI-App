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

export async function genereazSinteza(name_materie: string, file_name: string): Promise<boolean> {
    for (let it of data_study.data) {
        if (it.name === name_materie) {
            for (let j of it.files) {
                let name: string = get_file_name(j.path);
                if (name === file_name) {
                    try {
                        await j.genereaza_sinteza(ai_models_available, device_ip, () => {
                            data_study.save();
                            broadcastStudyData();
                        }, config, (error: AiServerError) => {
                            j.is_computing = false;
                            j.sinteza = null;
                            data_study.AiServerError.push(error);
                            broadcastStudyData();
                        });
                        data_study.save();
                        broadcastStudyData();
                        return true;
                    } catch (error: any) {
                        const aiError: AiServerError = new AiServerError(
                            `parametri invalizi sinteza`,
                            `errorare generare sinteza datele name_materie:${name_materie} file_name:${file_name} sunt invalide`
                        );
                        data_study.AiServerError.push(aiError);
                        broadcastStudyData();
                        return false;
                    }
                }
            }
        }
    }

    const error: AiServerError = new AiServerError(
        `parametri invalizi sinteza`,
        `errorare generare sinteza datele name_materie:${name_materie} file_name:${file_name} sunt invalide`
    );
    data_study.AiServerError.push(error);
    broadcastStudyData();
    return false;
}

export async function genereazHTML(name_materie: string, file_name: string): Promise<boolean> {
    const style_index: number | undefined = config.html_style;

    if (style_index === undefined || !Number.isInteger(style_index) || style_index < 0 || style_index > 9) {
        const error: AiServerError = new AiServerError(
            `Invalid style index`,
            `style_index must be an integer between 0 and 9`
        );
        data_study.AiServerError.push(error);
        broadcastStudyData();
        return false;
    }

    for (let it of data_study.data) {
        if (it.name === name_materie) {
            for (let j of it.files) {
                let name: string = get_file_name(j.path);
                if (name === file_name) {
                    const onUpdate = () => {
                        data_study.save();
                        broadcastStudyData();
                    };

                    const setError = (error: AiServerError) => {
                        j.is_computing = false;
                        j.html_file = null;
                        data_study.AiServerError.push(error);
                        broadcastStudyData();
                    }

                    try {
                        await j.generateHTML(ai_models_available, device_ip, onUpdate, config, setError, style_index);
                        data_study.save();
                        broadcastStudyData();
                        return true;
                    } catch (error: any) {
                        const aiError: AiServerError = new AiServerError(
                            `parametri invalizi html`,
                            `errorare generare html datele name_materie:${name_materie} file_name:${file_name} sunt invalide`
                        );
                        data_study.AiServerError.push(aiError);
                        broadcastStudyData();
                        return false;
                    }
                }
            }
        }
    }

    const error: AiServerError = new AiServerError(
        `parametri invalizi html`,
        `errorare generare html datele name_materie:${name_materie} file_name:${file_name} sunt invalide`
    );
    data_study.AiServerError.push(error);
    broadcastStudyData();
    return false;
}

export async function handleContentGeneration(req: Request, res: Response) {
    const name_materie = req.body.name_materie;
    const file_name = req.body.file_name;

    if (!name_materie || !file_name) {
        return res.send("n");
    }

    const sintezaSuccess = await genereazSinteza(name_materie, file_name);
    if (!sintezaSuccess) {
        return res.send("n");
    }

    const htmlSuccess = await genereazHTML(name_materie, file_name);
    if (!htmlSuccess) {
        return res.send("n");
    }

    return res.send("y");
}




export function getSintezaHtmlPosilbleStyles(req: Request, res: Response){
  res.send(htmlStyles);
}