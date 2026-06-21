import { getLmStudioDevice } from "../index.js";
import { get_compleation } from "../services/llm.js";
import { Config } from "../objects/Config.js";
import { LMStudioClient } from "@lmstudio/sdk";

export async function runTest() {
  console.log("--- Starting LLM Completion Unit Test ---");

  try {
    const address = await getLmStudioDevice();
    if (!address) {
      console.error("Failed to connect to LM Studio.");
      return;
    }
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

    /* 
    // --- INFERENCE LOGIC (COMMENTED OUT) ---
    const firstModel = models[0];
    console.log(`Using first model: ${firstModel.path}`);

    const config = new Config();
    const testContent = "Hello, can you provide a short greeting?";
    const systemPrompt = "You are a helpful assistant.";
    console.log("Running get_compleation...");
    const result = await get_compleation(
      testContent,
      systemPrompt,
      () => true,
      address,
      firstModel.path,
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
    */

  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    console.log("--- Test Finished ---");
  }
}
