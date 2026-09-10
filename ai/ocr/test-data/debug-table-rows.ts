import { extractWordsFromImage } from "../image/ocr-extractor";

const imagePath = "ai/ocr/test-data/generated-pages/invoice-1.png";

async function main() {
  const words = await extractWordsFromImage(imagePath);

  const tableWords = words
    .filter((word) => word.y >= 1150 && word.y <= 1850)
    .sort((a, b) => a.y - b.y);

  console.log("\n🔎 TABLE WORDS WITH COORDINATES:\n");

  for (const word of tableWords) {
    console.log(
      `${word.text.padEnd(20)} | ` +
      `x=${word.x.toString().padEnd(5)} | ` +
      `y=${word.y.toString().padEnd(5)} | ` +
      `w=${word.width.toString().padEnd(5)} | ` +
      `h=${word.height.toString().padEnd(5)} | ` +
      `conf=${word.confidence.toFixed(1)}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});