import { Request, Response } from "express";
import { ai_models_available, broadcastStudyData, config, device_ip, getLmStudioDevice} from "../index.js";
import { check_evaluation_parameters } from "../services/data_validation.js";
import { get_file_name } from "../services/file-processor.js";
import { data_study, set_device_id, set_v, v_interval } from "../services/state.js";
import { AiTextCorectionElement } from "../objects/Evaluation.js";
import { AiServerError } from "../objects/AiTypes.js";

export async function askFileQuestion(req: Request, res: Response): Promise<void> {
  const { quality, question, materie, file } = req.body;
  if (quality === undefined || !question || !materie || !file) {
    res.send("n");
    return;
  }

  let sinteza: string | null = null;
  for (let m of data_study.data) {
    if (m.name.toLowerCase() === materie.toLowerCase()) {
      for (let f of m.files) {
        if (get_file_name(f.path) === get_file_name(file)) {
          sinteza = f.sinteza;
          break;
        }
      }
    }
  }

  if (!sinteza) {
    const front_end_error_message = new AiServerError("sinteza negenerata", `sinteza pt acest fishier ${get_file_name(file)} nu este generata`);
    data_study.AiServerError.push(front_end_error_message);
    broadcastStudyData();
    res.send("n");
    return;
  }

  if (!device_ip) {
    set_device_id(await getLmStudioDevice());
    if (!device_ip) {
      const front_end_error_message = new AiServerError("lmstudio not found", `no lmstudio instance found on the local network`);
      data_study.AiServerError.push(front_end_error_message);
      broadcastStudyData();
      res.send('n');
      return;
    }
  }

  data_study.CurrentAskedQuestion.askQuestion(
    ai_models_available,
    device_ip,
    materie,
    sinteza,
    question,
    quality,
    config,
    (e: AiServerError) => {
      data_study.AiServerError.push(e);
      broadcastStudyData();
    }
  );

  res.send("y");
}

export async function stopAnsweringQuestion(req: Request, res: Response): Promise<void> {
  data_study.CurrentAskedQuestion.stop();
  res.send("y");
}

export async function processEvaluare(req: Request, res: Response): Promise<void> {
  const { quiz, raspunsuri } = req.body;
  if (!check_evaluation_parameters(quiz, raspunsuri, true) || device_ip === null) {
    console.log("invalid parameters");
    res.send("n");
    return;
  }

  console.log("valid parameters");
  try {
    if (data_study.AiTextCorrection.get_is_computiong()) {
      console.log("is pre computing");
      res.send("y");
      return;
    }

    data_study.AiTextCorrection = new AiTextCorectionElement(quiz, raspunsuri);
    await data_study.AiTextCorrection.evaluare_all(
      "nespecificat",
      config.limba,
      (error: AiServerError) => {
        data_study.AiServerError.push(error);
        broadcastStudyData();
      },
      config,
      device_ip
    );

    console.log("evaluation call successful");
    res.send("y");
  } catch (e) {
    console.log(e);
    res.send("n");
  }
}

export async function ClearEvaluare(req: Request, res: Response): Promise<void> {
  if (data_study.AiTextCorrection.get_is_computiong() && v_interval === null) {
    const intervalId = setInterval(() => {
      if (!data_study.AiTextCorrection.get_is_computiong()) {
        data_study.AiTextCorrection = new AiTextCorectionElement(null, []);
        clearInterval(v_interval!);
        set_v(0 as any);
        broadcastStudyData();
      }
    }, 1000);
    
    set_v(intervalId as any);
    res.send("n");
  } else {
    data_study.AiTextCorrection = new AiTextCorectionElement(null, []);
    broadcastStudyData();
    res.send('y');
  }
}

export async function DeactivateErrorMessage(req: Request, res: Response): Promise<void> {
  const { index } = req.body;
  console.log("index:" + index);
  if (typeof index !== "number") {
    res.send("n");
    return;
  }

  try {
    data_study.AiServerError = data_study.AiServerError.filter((it, i) => i !== index);
    console.log(data_study.AiServerError[index]);
    broadcastStudyData();
  } catch (e) {
    res.send(`n`);
    return;
  }

  res.send("y");
}
