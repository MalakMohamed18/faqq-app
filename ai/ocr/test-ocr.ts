import { extractTextFromImage } from "./ocr-extractor";

async function test() {
  const imagePath = "ai\\ocr\\test-data\\invoice.webp";

  console.log("👤 Image:");
  console.log(imagePath);

  try {
    const text = await extractTextFromImage(imagePath);

    console.log("\n================ OCR RESULT ================\n");
    console.log(text);
    console.log("\n=============================================\n");
  } catch (error) {
    console.error("\n❌ OCR Error:");
    console.error(error);
  }
}

test();