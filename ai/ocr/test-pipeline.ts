import { processInvoice } from "./ocr-pipeline";

async function test() {
  const imagePath = "ai\\ocr\\test-data\\invoice.webp";

  console.log(" Invoice:");
  console.log(imagePath);

  try {
    const result = await processInvoice(imagePath);
    console.dir(result, {
      depth: null,
    });

  } catch (error) {
    console.error("\n OCR Pipeline Error:");
    console.error(error);
  }
}

test();