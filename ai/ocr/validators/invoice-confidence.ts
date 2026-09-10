import type { InvoiceData } from "../schemas/invoice.schema";

export type ConfidenceLevel = "high" | "medium" | "low";

export type FieldConfidence = {
  score: number;
  level: ConfidenceLevel;
  source: "ocr" | "calculated" | "inferred" | "conflict" | "ambiguous";
  issues: string[];
};

function getLevel(score: number): ConfidenceLevel {
  if (score >= 0.85) return "high";
  if (score >= 0.6) return "medium";
  return "low";
}

function field(
  score: number,
  source: FieldConfidence["source"],
  issues: string[] = []
): FieldConfidence {
  return {
    score,
    level: getLevel(score),
    source,
    issues,
  };
}

export function calculateInvoiceConfidence(
  invoice: InvoiceData,
  rawText: string,
  validation: {
    valid: boolean;
    needs_review: boolean;
    warnings: string[];
    calculated_items_total: number;
  }
) {
  const text = rawText.toLowerCase();

  const result = {
    invoice_number: field(
      text.includes(invoice.invoice_number ?? "")
        ? 0.95
        : 0.2,
      text.includes(invoice.invoice_number ?? "")
        ? "ocr"
        : "ambiguous",
      text.includes(invoice.invoice_number ?? "")
        ? []
        : ["Invoice number was not clearly found in OCR text"]
    ),

    supplier: field(
      invoice.supplier && text.includes(invoice.supplier.toLowerCase())
        ? 0.95
        : 0.2,
      invoice.supplier && text.includes(invoice.supplier.toLowerCase())
        ? "ocr"
        : "ambiguous",
      invoice.supplier && text.includes(invoice.supplier.toLowerCase())
        ? []
        : ["Supplier name was not clearly found in OCR text"]
    ),

    date: field(
      invoice.date && text.includes(invoice.date)
        ? 0.95
        : 0.2,
      invoice.date && text.includes(invoice.date)
        ? "ocr"
        : "ambiguous",
      invoice.date && text.includes(invoice.date)
        ? []
        : ["Invoice date was not clearly found in OCR text"]
    ),

    items: field(
      invoice.items.length > 0 ? 0.95 : 0.1,
      invoice.items.length > 0 ? "ocr" : "ambiguous",
      invoice.items.length > 0
        ? []
        : ["No invoice items were extracted"]
    ),

    subtotal: field(
      invoice.subtotal !== null ? 0.7 : 0.1,
      invoice.subtotal !== null ? "inferred" : "ambiguous",
      invoice.subtotal !== null
        ? ["Subtotal was inferred from invoice data"]
        : ["Subtotal was not identified"]
    ),

    tax: field(
      invoice.tax !== null ? 0.85 : 0.1,
      invoice.tax !== null ? "ocr" : "ambiguous",
      invoice.tax !== null
        ? []
        : ["Tax was not identified"]
    ),

    discount: field(
      invoice.discount !== null ? 0.4 : 0.1,
      invoice.discount !== null ? "ambiguous" : "ambiguous",
      invoice.discount !== null
        ? ["Discount label is unclear in OCR text"]
        : ["Discount was not identified"]
    ),

    amount_due: field(
      invoice.amount_due !== null ? 0.9 : 0.1,
      invoice.amount_due !== null ? "ocr" : "ambiguous",
      invoice.amount_due !== null
        ? []
        : ["Amount due was not identified"]
    ),

    total: field(
      validation.calculated_items_total === invoice.total
        ? 0.95
        : 0.2,
      validation.calculated_items_total === invoice.total
        ? "calculated"
        : "conflict",
      validation.calculated_items_total === invoice.total
        ? []
        : [
            "Invoice total does not match sum of invoice items",
          ]
    ),

    currency: field(
      invoice.currency === "USD" ? 0.6 : 0.9,
      invoice.currency === "USD"
        ? "inferred"
        : "ocr",
      invoice.currency === "USD"
        ? ["Currency was inferred from the $ symbol"]
        : []
    ),
  };

  const needsReview =
    validation.needs_review ||
    Object.values(result).some(
      (item) => item.level === "low"
    );

  return {
    fields: result,
    needs_review: needsReview,
  };
}