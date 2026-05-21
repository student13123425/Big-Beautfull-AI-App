import { BaseLoadModelOpts, Chat, LLMLoadModelConfig, LMStudioClient, ModelInfo } from "@lmstudio/sdk";
import { AiServerError, Config } from "../objects.js"; 
import { extractFinalContent, removeXmlStyleTags } from "../ai/prompts.js";

export async function getCompletion(
  content: string,
  system_prompt: string,
  shouldContinue: () => boolean,
  url: string,
  model_name: string,
  image_path: string | null,
  realTimeUpdate: ((text: string) => void) | null,
  setError: (error: AiServerError) => void,
  task_name: string,
  cfg: Config
): Promise<string | null> {
  try {
    const client = await new LMStudioClient({ baseUrl: url });
    
    const modelConfig: BaseLoadModelOpts<LLMLoadModelConfig> = {
      config: { 
        contextLength: cfg.model_token_limit, 
        evalBatchSize: 512 
      },
    };

    const model = await client.llm.model(model_name, modelConfig);

    const messages: any[] = [
      { role: 'system', content: system_prompt },
      { 
        role: 'user', 
        content: image_path ? [
          { type: 'text', text: content },
          { type: 'image_url', image_url: { url: image_path } }
        ] : content
      }
    ];

    const chat = Chat.from(messages);
    let output = "";
    let reasoningBuffer = ""; 

    let prediction: AsyncIterable<any>;
    try {
      if (model_name === "gpt-oss") {
        prediction = model.respond(chat, { inference: { reasoning_effort: "high" } });
      } else {
        prediction = model.respond(chat);
      }
    } catch (err1) {
      try {
        if (model_name === "gpt-oss") {
          prediction = model.respond({
            messages: chat,
            reasoning_effort: "high"
          } as any);
        } else {
          prediction = model.respond(chat);
        }
      } catch (err2) {
        console.warn("model.respond with inference options failed, falling back to basic respond.", err1, err2);
        prediction = model.respond(chat);
      }
    }

    for await (const fragment of prediction) {
      if (!shouldContinue()) {
        console.log("Generation stopped by user");
        return null;
      }

      const contentFragment = (fragment && (fragment.content ?? fragment.delta?.content)) ?? "";
      const reasoningFragment = (fragment && (fragment.reasoning ?? fragment.delta?.reasoning)) ?? null;

      if (reasoningFragment) {
        if (typeof reasoningFragment === "string") {
          reasoningBuffer += reasoningFragment;
        } else {
          try {
            reasoningBuffer += JSON.stringify(reasoningFragment);
          } catch {
            reasoningBuffer += String(reasoningFragment);
          }
        }
      }

      output += contentFragment;

      let filteredOutput: string;
      if (model_name === "gpt-oss") {
        filteredOutput = extractFinalContent(output);
      } else {
        filteredOutput = removeXmlStyleTags(output);
      }

      if (typeof realTimeUpdate === "function") {
        realTimeUpdate(filteredOutput);
      }
    }

    let finalFiltered: string;
    if (model_name === "gpt-oss") {
      finalFiltered = extractFinalContent(output).trim();
    } else {
      finalFiltered = removeXmlStyleTags(output).trim();
    }

    if (reasoningBuffer) {
      console.log(`Accumulated reasoning (truncated 2000 chars): ${reasoningBuffer.slice(0, 2000)}`);
    }

    return finalFiltered;

  } catch (e) {
    setError(
      new AiServerError(
        "eroare lmstudio",
        `lmstudio nu a reușit să genereze text pentru ${task_name} din cauza erorii ${String(e)}`
      )
    );
    console.error(`Error generating content: ${e}`);
    return null;
  }
}

export function get_compleation(
  content: string,
  system_prompt: string,
  shouldContinue: () => boolean,
  url: string,
  model_name: string,
  image_path: string | null,
  realTimeUpdate: Function | null,
  setError: (error: AiServerError) => void,
  task_name: string,
  cfg: Config
): Promise<string | null> {
    return getCompletion(
        content, 
        system_prompt, 
        shouldContinue, 
        url, 
        model_name, 
        image_path, 
        realTimeUpdate as any, 
        setError, 
        task_name, 
        cfg
    );
}
