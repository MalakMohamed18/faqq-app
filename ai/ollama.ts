import ollama from "ollama";

export const OLLAMA_MODEL = "qwen3:4b";

type OllamaOptions = {
  format?: "json";
};

export async function askOllama(
  systemPrompt: string,
  userMessage: string,
  options: OllamaOptions = {}
): Promise<string> {
  const response = await ollama.chat({
    model: OLLAMA_MODEL,

    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],

    stream: false,

    think: false,

    ...(options.format
      ? {
          format: options.format,
        }
      : {}),

    options: {
      temperature: 0,
      num_predict: 800,
    },
  });

  return response.message.content.trim();
}