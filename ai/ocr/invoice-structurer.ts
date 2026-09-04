import { askOllama } from "../ollama";
import { InvoiceSchema } from "./schemas/invoice.schema";
import { INVOICE_STRUCTURER_PROMPT } from "./prompts/invoice-structurer.prompt";

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
    throw new Error("No valid JSON found");
  }

  const jsonText = cleaned.slice(start, end + 1);

  try {
    return JSON.parse(jsonText);
  } catch {
    console.error("❌ Invalid JSON:");
    console.error(jsonText);

    throw new Error("Invalid JSON returned by Ollama");
  }
}

export async function structureInvoice(
  ocrText: string
) {
  console.log("\n🧠 Structuring invoice with Ollama...");

  const rawResponse = await askOllama(
    INVOICE_STRUCTURER_PROMPT,
    ocrText
  );

  console.log("\n📤 Ollama Response:");
  console.log(rawResponse);

  const parsed = extractJSON(rawResponse);

  const result = InvoiceSchema.safeParse(parsed);

  if (!result.success) {
    console.error("\n❌ Invoice Schema Error:");
    console.error(result.error);

    throw new Error("Invalid structured invoice");
  }

  console.log("\n✅ Invoice structure validated");

  return result.data;
}