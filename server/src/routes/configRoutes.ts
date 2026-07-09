import { Request, Response } from "express";
import { broadcastConfigData, config, is_dependecy} from "../index.js";
import { getSupportedLanguages } from "../services/ocr.js";
import { htmlStyles, server_os } from "../services/state.js";
import { Config } from "../objects/Config.js";

function getUserConfigFromRequest(req: Request): Config {
  const userId = (req.query.userId as string | undefined) || (req.body.userId as string | undefined);
  const userConfig = new Config();
  userConfig.setUserId(userId);
  userConfig.load();
  return userConfig;
}

export async function getConfig(req: Request, res: Response): Promise<void> {
  const userId = req.query.userId as string | undefined;
  
  if (userId) {
    // Per-user config: load from user-specific path
    const userConfig = new Config();
    userConfig.setUserId(userId);
    userConfig.load();
    res.json(userConfig);
  } else {
    // Global config (backward compatibility)
    res.json(config);
  }
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

  const userId = (req.query.userId as string | undefined) || (req.body.userId as string | undefined);
  
  if (userId) {
    // Per-user config
    const userConfig = new Config();
    userConfig.setUserId(userId);
    userConfig.load();
    userConfig.set_language(lang);
    userConfig.save();
    res.send("y");
  } else {
    // Global config
    config.set_language(lang);
    broadcastConfigData();
    res.send("y");
  }
}

export async function setContextSize(req: Request, res: Response): Promise<void> {
  if (!req.body.size || typeof req.body.size !== "number") {
    res.status(400).send("name");
    return;
  }

  const size: number = req.body.size;
  const userId = (req.query.userId as string | undefined) || (req.body.userId as string | undefined);
  
  if (userId) {
    // Per-user config
    const userConfig = new Config();
    userConfig.setUserId(userId);
    userConfig.load();
    userConfig.set_contentx_size(size);
    userConfig.save();
    res.send("y");
  } else {
    // Global config
    config.set_contentx_size(size);
    broadcastConfigData();
    res.send("y");
  }
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

  const userId = (req.query.userId as string | undefined) || (req.body.userId as string | undefined);
  
  if (userId) {
    // Per-user config
    const userConfig = new Config();
    userConfig.setUserId(userId);
    userConfig.load();
    userConfig.setSystemPrompt(prompt);
    userConfig.save();
    res.send("y");
  } else {
    // Global config
    config.setSystemPrompt(prompt);
    broadcastConfigData();
    res.send("y");
  }
}

export async function getDependencies(req: Request, res: Response): Promise<void> {
  res.json(is_dependecy);
}

export async function getOS(req: Request, res: Response): Promise<void> {
  res.json([server_os]);
}

export async function getHtmlStyle(req: Request, res: Response): Promise<void> {
  const userId = (req.query.userId as string | undefined) || (req.body.userId as string | undefined);
  
  if (userId) {
    // Per-user config
    const userConfig = new Config();
    userConfig.setUserId(userId);
    userConfig.load();
    res.send(htmlStyles.getStyles()[userConfig.html_style].name);
  } else {
    // Global config
    res.send(htmlStyles.getStyles()[config.html_style].name);
  }
}


export async function setHtmlStyle(req: Request, res: Response): Promise<void> {
  if (req.body.style === undefined || typeof req.body.style !== "number") {
    res.status(400).send("name");
    return;
  }

  const style: number = req.body.style;
  const userId = (req.query.userId as string | undefined) || (req.body.userId as string | undefined);
  
  if (userId) {
    // Per-user config
    const userConfig = new Config();
    userConfig.setUserId(userId);
    userConfig.load();
    userConfig.set_html_style(style);
    userConfig.save();
    res.send("y");
  } else {
    // Global config
    config.set_html_style(style);
    broadcastConfigData();
    res.send("y");
  }
}