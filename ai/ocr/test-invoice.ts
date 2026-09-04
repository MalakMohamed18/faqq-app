import { extractTextFromImage } from "./ocr-extractor";

async function test() {
  const imagePath = "./test-data/invoice.webp";

  try {
    const text = await extractTextFromImage(imagePath);

    console.log("\n================ OCR RESULT ================\n");
    console.log(text);
    console.log("\n=============================================\n");
  } catch (error) {
    console.error("❌ OCR Error:");
    console.error(error);
  }
}

test();