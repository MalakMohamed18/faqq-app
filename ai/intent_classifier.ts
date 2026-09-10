import { askOllama } from "./ollama";
import { IntentSchema } from "./schemas/intent.schema";
import { INTENT_CLASSIFIER_PROMPT } from "./prompts/intent-classifier.prompt";

function extractJSON(text: string): unknown {
  let cleaned = text.trim();
  const thinkEnd = cleaned.lastIndexOf("</think>");

  if (thinkEnd !== -1) {
    cleaned = cleaned
      .slice(thinkEnd + "</think>".length)
      .trim();
  }
  cleaned = cleaned
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    console.error(" No valid JSON object found.");
    console.error("Raw response:", text);

    throw new Error("Ollama did not return valid JSON");
  }

  const jsonText = cleaned.slice(start, end + 1);

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error(" Invalid JSON returned by Ollama:");
    console.error(jsonText);

    throw new Error("Ollama returned invalid JSON");
  }
}

export async function classifyIntent(userMessage: string) {
  const rawResponse = await askOllama(
    INTENT_CLASSIFIER_PROMPT,
    userMessage,
    { format: "json" }
  );

  console.log("\n Ollama Raw Response:");
  console.log(rawResponse);

  const parsedResponse = extractJSON(rawResponse);

  const result = IntentSchema.safeParse(parsedResponse);

  if (!result.success) {
    console.error("\n No valid Intent:");
    console.error(result.error);
    throw new Error("Ollama returned an invalid intent");
  }

  return result.data;
}
