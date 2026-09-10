import { createWorker, PSM } from "tesseract.js";
import { preprocessImage } from "./image-preprocessor";

export type OCRWord = {
  text: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type TSVData = {
  text?: string;
  tsv?: string;
};

function parseTSV(tsv: string): OCRWord[] {
  const lines = tsv.split("\n").filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  const words: OCRWord[] = [];

  for (const line of lines.slice(1)) {
    const columns = line.split("\t");

    if (columns.length < 12) {
      continue;
    }

    const level = Number(columns[0]);

    const x = Number(columns[6]);
    const y = Number(columns[7]);
    const width = Number(columns[8]);
    const height = Number(columns[9]);
    const confidence = Number(columns[10]);

    const text = columns[11]?.trim() ?? "";

    if (level !== 5) {
      continue;
    }

    if (!text) {
      continue;
    }

    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      !Number.isFinite(width) ||
      !Number.isFinite(height)
    ) {
      continue;
    }

    words.push({
      text,
      confidence: Number.isFinite(confidence) ? confidence : 0,
      x,
      y,
      width,
      height,
    });
  }

  return words;
}

export async function extractWordsFromImage(
  imagePath: string
): Promise<OCRWord[]> {
  console.log(" Starting OCR...");

  const processedImage = await preprocessImage(imagePath);

  const worker = await createWorker("ara+eng");

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_COLUMN, 
    });

    console.log(" Reading processed image...");

    const result = await worker.recognize(
      processedImage,
      {},
      {
        text: true,
        tsv: true,
      } as any
    );

    const data = result.data as unknown as TSVData;

    console.log(` OCR text length: ${data.text?.length ?? 0}`);
    console.log(` TSV length: ${data.tsv?.length ?? 0}`);

    const words = parseTSV(data.tsv ?? "");

    console.log(` OCR completed: ${words.length} words`);

    return words;
  } finally {
    await worker.terminate();
  }
}

export async function extractTextFromImage(
  imagePath: string
): Promise<string> {
  const words = await extractWordsFromImage(imagePath);

  return words
    .map((word) => word.text)
    .join(" ")
    .trim();
}