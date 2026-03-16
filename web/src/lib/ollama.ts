import { Ollama } from "ollama";
import type { Message } from "ollama";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

const ollamaClient = new Ollama({ host: OLLAMA_BASE_URL });

export interface StreamChunk {
  content: string;
  done: boolean;
}

/**
 * Generate a caption by streaming the response from Ollama.
 * Yields partial content chunks as they arrive.
 */
export async function* generateCaption(
  messages: Message[],
  model: string
): AsyncGenerator<StreamChunk> {
  const response = await ollamaClient.chat({
    model,
    messages,
    stream: true,
    options: {
      temperature: 0.8,
      top_p: 0.9,
      num_predict: 2048,
      repeat_penalty: 1.1,
    },
  });

  for await (const chunk of response) {
    yield {
      content: chunk.message.content,
      done: chunk.done,
    };
  }
}

/**
 * Generate a structured JSON response from Ollama (non-streaming).
 * Uses format: "json" to ensure valid JSON output.
 */
export async function generateJSON<T = unknown>(
  messages: Message[],
  model: string
): Promise<T> {
  const response = await ollamaClient.chat({
    model,
    messages,
    stream: false,
    format: "json",
    options: {
      temperature: 0.7,
      top_p: 0.9,
      num_predict: 4096,
      repeat_penalty: 1.1,
    },
  });

  const raw = response.message.content.trim();

  try {
    return JSON.parse(raw) as T;
  } catch {
    // Attempt to extract JSON from markdown code blocks
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch?.[1]) {
      return JSON.parse(jsonMatch[1].trim()) as T;
    }
    throw new Error(`Failed to parse JSON response from model: ${raw.slice(0, 200)}`);
  }
}

/**
 * List all locally available models.
 */
export async function listModels(): Promise<
  Array<{ name: string; size: number; modifiedAt: Date; digest: string }>
> {
  const response = await ollamaClient.list();

  return response.models.map((model) => ({
    name: model.name,
    size: model.size,
    modifiedAt: model.modified_at,
    digest: model.digest,
  }));
}

/**
 * Check if the Ollama server is reachable and healthy.
 */
export async function checkHealth(): Promise<{
  healthy: boolean;
  models: string[];
  error?: string;
}> {
  try {
    const models = await listModels();
    return {
      healthy: true,
      models: models.map((m) => m.name),
    };
  } catch (error) {
    return {
      healthy: false,
      models: [],
      error: error instanceof Error ? error.message : "Unknown error connecting to Ollama",
    };
  }
}

export { ollamaClient };
