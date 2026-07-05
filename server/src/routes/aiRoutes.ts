import { Request, Response } from "express";
import { broadcastConfigData, discoverLmStudioDevice } from "../index.js";
import { ai_models_available, config, device_ip, set_device_id, supported_models } from "../services/state.js";

export async function getModels(req: Request, res: Response): Promise<void> {
  try {
    if (ai_models_available.length === 0) {
      await discoverLmStudioDevice();
    }
    res.json(ai_models_available);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getModelPaths(req: Request, res: Response): Promise<void> {
  try {
    if (ai_models_available.length === 0) {
      await discoverLmStudioDevice();
    }
    res.json(ai_models_available.map((it) => it.path));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getIP(req: Request, res: Response): Promise<void> {
  if (device_ip === null) {
    await discoverLmStudioDevice();
  }
  res.json(device_ip);
}

export async function setSelectedModel(req: Request, res: Response): Promise<void> {
  if (!req.body.name) {
    res.status(400).send("name");
    return;
  }
  
  const name_string: string = req.body.name;
  if (supported_models.includes(name_string)) {
    config.set_model(name_string);
    broadcastConfigData();
    res.send("y");
  } else {
    console.log("invalid model select");
    res.send('n');
  }
}

export async function getSelectedModel(req: Request, res: Response): Promise<void> {
  res.json(supported_models);
}

