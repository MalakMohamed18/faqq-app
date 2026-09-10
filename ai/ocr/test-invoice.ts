import { extractTextFromImage } from "./image/ocr-extractor";

async function test() {
  const imagePath = "./test-data/invoice.webp";

  try {
    const text = await extractTextFromImage(imagePath);

    console.log("\nOCR RESULT \n");
    console.log(text);
  } catch (error) {
    console.error(" OCR Error:");
    console.error(error);
  }
}

test();