import dotenv from "dotenv";
import { get_compleation } from "../services/llm.js";
import { Config } from "../objects/Config.js";
import { LMStudioClient } from "@lmstudio/sdk";

dotenv.config();

export async function runTest() {
  console.log("--- Starting LLM Completion Unit Test ---");

  try {
    let lmStudioUrl = process.env.LM_STUDIO_URL || "http://192.168.0.88:1234";
    lmStudioUrl = lmStudioUrl.replace(/^https?:\/\/|^ws:\/\/|^wss:\/\//, "");
    const address = `ws://${lmStudioUrl}`;
    
    console.log(`Connecting to LM Studio at: ${address}...`);

    console.log(`Connected to LM Studio at: ${address}`);
    
    const client = new LMStudioClient({ baseUrl: address });
    console.log("Fetching downloaded models...");
    const models = await client.system.listDownloadedModels();

    if (models.length === 0) {
      console.error("No models found in LM Studio.");
      return;
    }

    console.log("Available Models:");
    models.forEach((model, index) => {
      console.log(`${index + 1}: ${model.path}`);
    });

    const targetModelPattern = "qwen3.6-35b-a3b";
    let selectedModel = models.find(m => 
      m.path.toLowerCase().includes(targetModelPattern.toLowerCase())
    );

    if (!selectedModel) {
      console.error(`No model found matching "${targetModelPattern}". Available models:`);
      models.forEach(m => console.error(`  - ${m.path}`));
      return;
    }

    const modelName = selectedModel.path;
    console.log(`Using model: ${modelName}`);

    const config = new Config();
    const testContent = "Hello, can you provide a short greeting?";
    const systemPrompt = "You are a helpful assistant.";
    console.log("Running get_compleation...");
    const result = await get_compleation(
      testContent,
      systemPrompt,
      () => true,
      modelName,
      null,
      (text) => console.log(`[RealTime] ${text}`),
      (err) => console.error(`[Error] ${err}`),
      "Unit_Test_Task",
      config
    );

    if (result) {
      console.log(`\nSUCCESS! Received result:`);
      console.log(result);
    } else {
      console.log("\nFAILED: Received null result.");
    }

  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    console.log("--- Test Finished ---");
  }
}
