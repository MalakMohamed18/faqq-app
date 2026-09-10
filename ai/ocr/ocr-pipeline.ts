import { extractTextFromImage } from "./image/ocr-extractor";
import { extractTextFromPDF } from "./pdf/pdf-extractor";
import { convertPDFToImages } from "./pdf/pdf-to-images";

import { detectFileType } from "./file-type";

import { normalizeOCRText } from "./ocr-normalizer";
import { structureInvoice } from "./invoice-structurer";
import { parseNormalizedInvoice } from "./invoice-parser";

import { validateInvoiceBusinessRules } from "./validators/invoice.validator";

import {
  InvoiceSchema,
  type InvoiceData,
} from "./schemas/invoice.schema";

function isWeakInvoice(
  invoice: InvoiceData
): boolean {
  const completeItems =
    invoice.items.filter(
      (item) =>
        item.product !== null &&
        item.quantity !== null &&
        item.unit_price !== null &&
        item.total !== null
    );

  const hasUsefulTotal =
    invoice.total !== null ||
    invoice.amount_due !== null;

  const hasUsefulDate =
    invoice.date !== null;

  const hasUsefulItems =
    completeItems.length > 0;

  return (
    !hasUsefulDate &&
    !hasUsefulItems &&
    !hasUsefulTotal
  );
}

function convertPartialToInvoice(
  partial: Partial<InvoiceData>
): InvoiceData {
  return {
    invoice_number:
      partial.invoice_number ?? null,

    supplier:
      partial.supplier ?? null,

    date:
      partial.date ?? null,

    items:
      partial.items ?? [],

    subtotal:
      partial.subtotal ?? null,

    tax:
      partial.tax ?? null,

    discount:
      partial.discount ?? null,

    amount_due:
      partial.amount_due ?? null,

    total:
      partial.total ?? null,

    currency:
      partial.currency ?? null,
  };
}

async function extractPDFTextWithOCR(
  pdfPath: string
): Promise<string> {
  console.log(
    "\n Falling back to image OCR..."
  );

  const imagePaths =
    await convertPDFToImages(pdfPath);

  const pageTexts: string[] = [];

  for (const imagePath of imagePaths) {
    console.log(
      `\n Running OCR on: ${imagePath}`
    );

    const pageText =
      await extractTextFromImage(
        imagePath
      );

    if (pageText.trim()) {
      pageTexts.push(pageText);
    }
  }

  const ocrText =
    pageTexts.join("\n").trim();

  console.log(
    "\n PDF OCR completed"
  );

  return ocrText;
}

export async function processInvoice(
  filePath: string
) {
  console.log(
    "\n Starting Invoice Pipeline..."
  );

  const fileType =
    detectFileType(filePath);

  console.log(
    ` File type detected: ${fileType}`
  );

  let rawText: string;

  if (fileType === "image") {
    console.log(
      "\n Extracting text from image..."
    );

    rawText =
      await extractTextFromImage(
        filePath
      );
  } else {
    console.log(
      "\n Extracting text from PDF..."
    );

    const extractedText =
      await extractTextFromPDF(
        filePath
      );

    console.log(
      ` Extracted text length: ${extractedText.length}`
    );

    rawText = extractedText;

    void extractPDFTextWithOCR;
  }

  console.log(
    "\n Text extraction completed"
  );

  console.log(
    "\n Normalizing text..."
  );

  const normalizedText =
    normalizeOCRText(rawText);

  console.log(
    "\n Normalized Text:"
  );

  console.log(normalizedText);

  let invoice: InvoiceData;

  console.log(
    "\n Structuring invoice..."
  );

  try {
    invoice =
      await structureInvoice(
        normalizedText
      );

    if (isWeakInvoice(invoice)) {
      console.log(
        "\n AI result is too weak."
      );

      console.log(
        " Falling back to deterministic parser..."
      );

      const fallback =
        parseNormalizedInvoice(
          normalizedText
        );

      invoice =
        convertPartialToInvoice(
          fallback
        );
    }
  } catch (error) {
    console.log(
      "\n AI structuring failed."
    );

    console.log(
      " Falling back to deterministic parser..."
    );

    const fallback =
      parseNormalizedInvoice(
        normalizedText
      );

    invoice =
      convertPartialToInvoice(
        fallback
      );
  }

  const schemaResult =
    InvoiceSchema.safeParse(invoice);

  if (!schemaResult.success) {
    console.error(
      "\n Final Invoice Schema Error:"
    );

    console.error(
      schemaResult.error
    );

    throw new Error(
      "Final invoice structure is invalid"
    );
  }

  invoice = schemaResult.data;

  console.log(
    "\n Structured Invoice:"
  );

  console.dir(invoice, {
    depth: null,
  });

  console.log(
    "\n Validating invoice..."
  );

  const validation =
    validateInvoiceBusinessRules(
      invoice
    );

  console.log(
    "\n Validation Result:"
  );

  console.dir(validation, {
    depth: null,
  });

  return {
    file_type: fileType,
    rawText,
    normalizedText,
    invoice,
    validation,
  };
}