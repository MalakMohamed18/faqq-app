import { processInvoice } from "./ocr-pipeline";
import fs from 'fs';
import path from 'path';

const generatedDir = path.join(__dirname, 'test-data/generated-pages');
if (fs.existsSync(generatedDir)) {
  fs.rmSync(generatedDir, { recursive: true, force: true });
}
async function main() {
  const pdfPath =
    "ai/ocr/test-data/invoice.pdf";

  try {
    const result = await processInvoice(pdfPath);

    console.log("\n PDF PIPELINE RESULT:");
    console.dir(result, { depth: null });
  } catch (error) {
    console.error("\n PDF TEST FAILED:");
    console.error(error);
    process.exit(1);
  }
}

main();