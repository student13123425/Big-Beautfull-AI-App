import { Request, Response } from "express";
import { mkdir, mkdirSync, rmSync } from "fs";
import { broadcastStudyData, config, getLmStudioDevice } from "../index.js";
import { get_file_name, getDirectoryContent } from "../services/file-processor.js";
import { ai_models_available, data_study, device_ip, htmlStyles } from "../services/state.js";
import { AiServerError } from "../objects/AiTypes.js";

/**
 * Ensures ai_models_available is populated by calling getLmStudioDevice if empty.
 */
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

    // Ensure models are available before proceeding
    await ensureModelsAvailable();

    const name_materie: string = req.body.name_materie;
    const file_name: string = req.body.file_name;

    for (let it of data_study.data) {
        if (it.name === name_materie) {
            for (let j of it.files) {
                let name: string = get_file_name(j.path);
                if (name === file_name) {
                    // Same fix as genereazSinteza: wait for regeneration to fully complete
                    // before responding, so that /study polling returns updated data.
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
    // Ensure models are available before proceeding
    await ensureModelsAvailable();

    for (let it of data_study.data) {
        if (it.name === name_materie) {
            for (let j of it.files) {
                let name: string = get_file_name(j.path);
                if (name === file_name) {
                    try {
                        // Wrap in a Promise that resolves ONLY after AI generation completes,
                        // data is saved to disk, and broadcast has been sent.
                        return new Promise<boolean>(async (resolve) => {
                            await j.genereaza_sinteza(
                                ai_models_available,
                                () => {
                                    data_study.save();
                                    broadcastStudyData();
                                    resolve(true); // Resolve AFTER save + broadcast
                                },
                                config,
                                (error: AiServerError) => {
                                    j.is_computing_sinteza = false;
                                    j.sinteza = null;
                                    data_study.AiServerError.push(error);
                                    broadcastStudyData();
                                    resolve(false); // Resolve on error too
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
    // Ensure models are available before proceeding
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
                    // Wrap in a Promise that resolves ONLY after HTML generation completes,
                    // data is saved to disk, and broadcast has been sent.
                    return new Promise<boolean>(async (resolve) => {
                        const onUpdate = () => {
                            data_study.save();
                            broadcastStudyData();
                            resolve(true); // Resolve AFTER save + broadcast
                        };

                        const setError = (error: AiServerError) => {
                            j.is_computing_html = false;
                            j.html_file = null;
                            data_study.AiServerError.push(error);
                            broadcastStudyData();
                            resolve(false); // Resolve on error too
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

    // Start sinteza generation and WAIT for it to FULLY COMPLETE (AI + save + broadcast).
    // The updated genereazSinteza() now returns a Promise that resolves only after
    // the AI model finishes generating, data_study.save() writes to disk, and
    // broadcastStudyData() sends updates to all connected WebSocket clients.
    console.log('[handleContentGeneration] Starting sinteza generation...');
    const sintezaSuccess = await genereazSinteza(name_materie, file_name);
    if (!sintezaSuccess) {
        console.log('[handleContentGeneration] Sinteza generation failed');
        return res.send("n");
    }
    console.log('[handleContentGeneration] Sinteza generation complete, data saved & broadcasted');

    // Small delay to ensure disk write completes before HTML generation starts.
    // This gives the filesystem time to flush and prevents race conditions with
    // concurrent /study polling requests that might read stale data.
    await new Promise(resolve => setTimeout(resolve, 100));

    // Start HTML generation and WAIT for it to FULLY COMPLETE (same guarantees as above).
    console.log('[handleContentGeneration] Starting HTML generation...');
    const htmlSuccess = await genereazHTML(name_materie, file_name);
    if (!htmlSuccess) {
        console.log('[handleContentGeneration] HTML generation failed');
        return res.send("n");
    }
    console.log('[handleContentGeneration] HTML generation complete, data saved & broadcasted');

    // At this point: both sinteza AND html are generated, saved to disk, and broadcasted.
    // Any /study request or WebSocket client will receive the updated data immediately.
    return res.send("y");
}




export function getSintezaHtmlPosilbleStyles(req: Request, res: Response){
  res.send(htmlStyles);
}