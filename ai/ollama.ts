import ollama from "ollama";

export const OLLAMA_MODEL = "qwen3:4b";

export async function askOllama(
  systemPrompt: string,
  userMessage: string
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

    // Qwen3 thinking
    think: false,

    options: {
      temperature: 0,
      num_predict: 1000,
    },
  });

  return response.message.content.trim();
}