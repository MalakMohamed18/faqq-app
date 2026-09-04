import { createWorker } from "tesseract.js";

export async function extractTextFromImage(
  imagePath: string
): Promise<string> {
  console.log("📸 Starting OCR...");

  const worker = await createWorker("ara+eng");

  try {
    console.log("🔍 Reading image...");

    const result = await worker.recognize(imagePath);

    const text = result.data.text.trim();

    console.log("✅ OCR completed");

    return text;
  } finally {
    await worker.terminate();
  }
}
