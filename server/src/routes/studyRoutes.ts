import { Request, Response } from "express";
import { mkdir, mkdirSync, rmSync } from "fs";
import { broadcastStudyData, config, getLmStudioDevice } from "../index.js";
import { get_file_name, getDirectoryContent } from "../services/file-processor.js";
import { ai_models_available, data_study, device_ip, htmlStyles } from "../services/state.js";
import { AiServerError } from "../objects/AiTypes.js";

async function ensureModelsAvailable(): Promise<void> {
  if (ai_models_available.length === 0) {
    console.log("[studyRoutes] ai_models_available is empty, fetching models from LM Studio...");
    try {
      await getLmStudioDevice();
    } catch (err) {
      console.error("[studyRoutes] Failed to fetch models from LM Studio:", err);
    }
  }
}

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

export async function regenereazSinteza(req: Request, res: Response): Promise<void> {
    if (!req.body.name_materie || !req.body.file_name) {
        res.send("n");
        return;
    }

    await ensureModelsAvailable();

    const name_materie: string = req.body.name_materie;
    const file_name: string = req.body.file_name;

    for (let it of data_study.data) {
        if (it.name === name_materie) {
            for (let j of it.files) {
                let name: string = get_file_name(j.path);
                if (name === file_name) {
                    await new Promise<void>(async (resolve) => {
                        j.regenerate_sinteza(
                            ai_models_available,
                            () => {
                                data_study.save();
                                broadcastStudyData();
                            },
                            config,
                            (error: AiServerError) => {
                                j.is_computing_sinteza = false;
                                j.sinteza = null;
                                data_study.AiServerError.push(error);
                                broadcastStudyData();
                            }
                        ).then(() => {
                            data_study.save();
                            broadcastStudyData();
                            resolve();
                        });
                    });
                    res.send("y");
                    return;
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
    res.send("n");
}

export async function genereazSinteza(name_materie: string, file_name: string): Promise<boolean> {
    await ensureModelsAvailable();

    for (let it of data_study.data) {
        if (it.name === name_materie) {
            for (let j of it.files) {
                let name: string = get_file_name(j.path);
                if (name === file_name) {
                    try {
                        return new Promise<boolean>(async (resolve) => {
                            await j.genereaza_sinteza(
                                ai_models_available,
                                () => {
                                    data_study.save();
                                    broadcastStudyData();
                                    resolve(true);
                                },
                                config,
                                (error: AiServerError) => {
                                    j.is_computing_sinteza = false;
                                    j.sinteza = null;
                                    data_study.AiServerError.push(error);
                                    broadcastStudyData();
                                    resolve(false);
                                }
                            );
                        });
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
    await ensureModelsAvailable();

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
                    return new Promise<boolean>(async (resolve) => {
                        const onUpdate = () => {
                            data_study.save();
                            broadcastStudyData();
                            resolve(true);
                        };

                        const setError = (error: AiServerError) => {
                            j.is_computing_html = false;
                            j.html_file = null;
                            data_study.AiServerError.push(error);
                            broadcastStudyData();
                            resolve(false);
                        };

                        try {
                            await j.generateHTML(ai_models_available, onUpdate, config, setError, style_index);
                        } catch (error: any) {
                            const aiError: AiServerError = new AiServerError(
                                `parametri invalizi html`,
                                `errorare generare html datele name_materie:${name_materie} file_name:${file_name} sunt invalide`
                            );
                            data_study.AiServerError.push(aiError);
                            broadcastStudyData();
                            resolve(false);
                        }
                    });
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
    console.log(name_materie, file_name);

    if (!name_materie || !file_name) {
        return res.send("n");
    }

    // Find the matching file and clear existing content before generation
    let targetFile: any = null;
    for (let it of data_study.data) {
        if (it.name === name_materie) {
            for (let j of it.files) {
                let name: string = get_file_name(j.path);
                if (name === file_name) {
                    targetFile = j;
                    break;
                }
            }
            if (targetFile) break;
        }
    }

    if (!targetFile) {
        console.log('[handleContentGeneration] File not found:', name_materie, '/', file_name);
        return res.send("n");
    }

    // Clear existing content and set computing flags
    targetFile.sinteza = null;
    targetFile.html_file = null;
    targetFile.is_computing_sinteza = true;
    targetFile.is_computing_html = false;
    data_study.save();
    broadcastStudyData();

    console.log('[handleContentGeneration] Cleared existing content, starting sinteza generation...');
    const sintezaSuccess = await genereazSinteza(name_materie, file_name);
    if (!sintezaSuccess) {
        console.log('[handleContentGeneration] Sinteza generation failed');
        return res.send("n");
    }
    console.log('[handleContentGeneration] Sinteza generation complete, data saved & broadcasted');

    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('[handleContentGeneration] Starting HTML generation...');
    const htmlSuccess = await genereazHTML(name_materie, file_name);
    if (!htmlSuccess) {
        console.log('[handleContentGeneration] HTML generation failed');
        return res.send("n");
    }
    console.log('[handleContentGeneration] HTML generation complete, data saved & broadcasted');

    return res.send("y");
}




export function getSintezaHtmlPosilbleStyles(req: Request, res: Response){
  res.send(htmlStyles);
}