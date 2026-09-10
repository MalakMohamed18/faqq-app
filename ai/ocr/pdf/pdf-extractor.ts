import fs from "fs";
import { PDFParse } from "pdf-parse";

import { convertPDFToImages } from "./pdf-to-images";
import { extractTextFromImage } from "../image/ocr-extractor";
import { checkPDFTextQuality } from "./pdf-quality";

export async function extractTextFromPDF(
  pdfPath: string
): Promise<string> {
  console.log(" Starting PDF extraction...");

  const buffer = fs.readFileSync(pdfPath);

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    const extractedText = result.text.trim();

    console.log(` PDF pages: ${result.total}`);
    console.log(
      ` Extracted text length: ${extractedText.length}`
    );

    const quality =
      checkPDFTextQuality(extractedText);

    console.log("\n PDF Text Quality:");
    console.dir(quality, { depth: null });

    if (quality.usable) {
      console.log(" PDF text is usable");

      return extractedText;
    }
    console.log(
      " PDF text quality is too low"
    );

    console.log(
      " Falling back to image OCR..."
    );
    const imagePaths =
      await convertPDFToImages(pdfPath);

    const pageTexts: string[] = [];
    for (const imagePath of imagePaths) {
      console.log(
        `\n Running OCR on: ${imagePath}`
      );

      const pageText =
        await extractTextFromImage(imagePath);

      if (pageText.trim()) {
        pageTexts.push(pageText);
      }
    }

    const ocrText =
      pageTexts.join("\n").trim();

    console.log("\n PDF OCR completed");

    return ocrText;
  } finally {
    await parser.destroy();
  }
}