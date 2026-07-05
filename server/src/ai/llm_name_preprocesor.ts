import { discoverLmStudioDevice } from "../index.js";
import { ai_models_available } from "../services/state.js";

export async function getSupportedModels(): Promise<string[]> {
  // Ensure models are loaded via discovery (reads address from .env)
  await discoverLmStudioDevice();

  if (ai_models_available.length === 0) {
    return [];
  }

  return ai_models_available.map((model) => model.path as string);
}

export async function llm_name_preprocessor(supportedModels: string[]): Promise<string[]> {
    const fullModelList: string[] = await getSupportedModels();
    const matchedPaths: string[] = [];

    for (const shortName of supportedModels) {
      const match = fullModelList.find((fullPath: string) => fullPath.includes(shortName));

      if (match) {
        matchedPaths.push(match);
      } else {
        console.error(`Error: Model "${shortName}" was not found in the available LM Studio models.`);
      }
    }
    
    console.log(matchedPaths);
    
    return matchedPaths;
}