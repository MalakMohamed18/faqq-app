import { extractWordsFromImage } from "../image/ocr-extractor";
import { reconstructInvoiceItems } from "../image/ocr-table-reconstructor";

const imagePath = "ai/ocr/test-data/generated-pages/invoice-1.png";

async function main() {
  console.log(" Testing OCR table reconstruction...\n");

  const words = await extractWordsFromImage(imagePath);

  console.log(` Total words: ${words.length}\n`);

  console.log(" RECONSTRUCTED TABLE:\n");

  const items = reconstructInvoiceItems(words);

  if (items.length > 0) {
    const tableText = items
      .map(
        (item, index) =>
          `ROW ${index + 1} | Product=${item.product} | Quantity=${
            item.quantity
          } | UnitPrice=${item.unit_price} | Total=${item.total}`
      )
      .join("\n");
    console.log(tableText);
  } else {
    console.log(" No invoice rows detected.");
  }

  console.log("\n\n STRUCTURED ITEMS:\n");

  console.dir(items, { depth: null });

  console.log("\n Test completed.");
}

main().catch((error) => {
  console.error("\n Test failed:");
  console.error(error);
  process.exit(1);
});