import { askOllama } from "../ollama";

import {
  InvoiceSchema,
  type InvoiceData,
} from "./schemas/invoice.schema";

import { INVOICE_STRUCTURER_PROMPT } from "./prompts/invoice-structurer.prompt";

function extractJSON(text: string): unknown {
  let cleaned = text.trim();

  const thinkEnd = cleaned.lastIndexOf("</think>");

  if (thinkEnd !== -1) {
    cleaned = cleaned
      .slice(thinkEnd + "</think>".length)
      .trim();
  }

  cleaned = cleaned
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (
    start === -1 ||
    end === -1 ||
    end <= start
  ) {
    throw new Error(
      "Ollama did not return valid JSON"
    );
  }

  return JSON.parse(
    cleaned.slice(start, end + 1)
  );
}

function isValidDate(
  value: unknown
): boolean {
  if (
    typeof value !== "string" ||
    !value
  ) {
    return false;
  }

  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function sanitizeInvoice(
  data: any
): InvoiceData {
  const items = Array.isArray(data?.items)
    ? data.items.map((item: any) => ({
        product:
          typeof item?.product === "string" &&
          item.product.trim()
            ? item.product.trim()
            : null,

        quantity:
          typeof item?.quantity === "number" &&
          Number.isFinite(item.quantity) &&
          item.quantity > 0
            ? item.quantity
            : null,

        unit_price:
          typeof item?.unit_price === "number" &&
          Number.isFinite(item.unit_price) &&
          item.unit_price >= 0
            ? item.unit_price
            : null,

        total:
          typeof item?.total === "number" &&
          Number.isFinite(item.total) &&
          item.total >= 0
            ? item.total
            : null,
      }))
    : [];

  let date =
    typeof data?.date === "string"
      ? data.date.trim()
      : null;

  if (date && !isValidDate(date)) {
    date = null;
  }

  return {
    invoice_number:
      typeof data?.invoice_number === "string"
        ? data.invoice_number.trim() || null
        : null,

    supplier:
      typeof data?.supplier === "string"
        ? data.supplier.trim() || null
        : null,

    date,

    items,

    subtotal:
      typeof data?.subtotal === "number"
        ? data.subtotal
        : null,

    tax:
      typeof data?.tax === "number"
        ? data.tax
        : null,

    discount:
      typeof data?.discount === "number"
        ? data.discount
        : null,

    amount_due:
      typeof data?.amount_due === "number"
        ? data.amount_due
        : null,

    total:
      typeof data?.total === "number"
        ? data.total
        : null,

    currency:
      typeof data?.currency === "string"
        ? data.currency.trim() || null
        : null,
  };
}

export async function structureInvoice(
  ocrText: string
): Promise<InvoiceData> {
  console.log(
    "\n Structuring invoice with Ollama..."
  );

  const rawResponse = await askOllama(
    INVOICE_STRUCTURER_PROMPT,
    ocrText,
    { format: "json" }
  );

  console.log("\n Ollama Response:");
  console.log(rawResponse);

  let parsed: unknown;

  try {
    parsed = extractJSON(rawResponse);
  } catch (error) {
    console.error(
      "\n Failed to parse Ollama JSON"
    );

    throw error;
  }

  const sanitized =
    sanitizeInvoice(parsed);

  const result =
    InvoiceSchema.safeParse(sanitized);

  if (!result.success) {
    console.error(
      "\n Invoice Schema Error:"
    );

    console.error(result.error);

    throw new Error(
      "Invalid structured invoice"
    );
  }

  console.log(
    "\n Invoice structure validated"
  );

  return result.data;
}