import { Request, Response } from "express";
import { broadcastConfigData, config, is_dependecy} from "../index.js";
import { getSupportedLanguages } from "../services/ocr.js";
import { htmlStyles, server_os } from "../services/state.js";

export async function getConfig(req: Request, res: Response): Promise<void> {
  res.json(config);
}

export async function setLanguage(req: Request, res: Response): Promise<void> {
  if (!req.body.lang) {
    res.status(400).send("name");
    return;
  }
  
  const lang = req.body.lang;
  if (!lang) {
    res.status(400).send("language");
    return;
  }

  const supportedLangs = getSupportedLanguages();
  if (!supportedLangs.includes(lang)) {
    console.log(`invalid language selected: ${lang}`);
    res.send('n');
    return;
  }

  config.set_language(lang);
  broadcastConfigData();
  res.send("y");
}

export async function setContextSize(req: Request, res: Response): Promise<void> {
  if (!req.body.size || typeof req.body.size !== "number") {
    res.status(400).send("name");
    return;
  }

  const size: number = req.body.size;
  config.set_contentx_size(size); // Kept original method name exactly as in source
  broadcastConfigData();
  res.send("y");
}

export async function setSystemPrompt(req: Request, res: Response): Promise<void> {
  if (!req.body.prompt) {
    res.status(400).send("name");
    return;
  }
  
  const prompt = req.body.prompt;
  if (!prompt) {
    res.status(400).send("prompt");
    return;
  }

  config.setSystemPrompt(prompt);
  broadcastConfigData();
  res.send("y");
}

export async function getDependencies(req: Request, res: Response): Promise<void> {
  res.json(is_dependecy); // Kept original variable name exactly as in source
}

export async function getOS(req: Request, res: Response): Promise<void> {
  res.json([server_os]);
}

export async function getHtmlStyle(req: Request, res: Response): Promise<void> {
  res.send(htmlStyles.getStyles()[config.html_style].name);
}


export async function setHtmlStyle(req: Request, res: Response): Promise<void> {
  if (!req.body.style || typeof req.body.style !== "number") {
    res.status(400).send("name");
    return;
  }
  
  const style: number = req.body.style;
  config.set_html_style(style);
  broadcastConfigData();
  res.send("y");
}
