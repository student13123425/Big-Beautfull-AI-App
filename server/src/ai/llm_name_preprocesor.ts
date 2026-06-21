import { getLmStudioDevice } from "../index.js";
import { LMStudioClient } from "@lmstudio/sdk";

export async function getSupportedModels(): Promise<string[]> {
  const address: string | null | undefined = await getLmStudioDevice();
  
  if (!address) {
    throw new Error("Failed to connect to LM Studio.");
  }

  const client = new LMStudioClient({ baseUrl: address });
  console.log("Fetching downloaded models...");
  
  const models: any[] = await client.system.listDownloadedModels();

  if (models.length === 0) {
    console.warn("No models found in LM Studio.");
    return [];
  }

  return models.map((model) => model.path as string);
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
