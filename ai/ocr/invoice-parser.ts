import type {
  InvoiceData,
  InvoiceItem,
} from "./schemas/invoice.schema";

function parseNumber(value: string): number {
  return Number(
    value
      .replace(/,/g, "")
      .replace(/[^\d.]/g, "")
  );
}

function parseItemLine(line: string): InvoiceItem | null {
  const match = line.match(
    /^ITEM\s*\|\s*product:\s*(.*?)\s*\|\s*quantity:\s*(.*?)\s*\|\s*unit_price:\s*(.*?)\s*\|\s*total:\s*(.*?)\s*$/
  );

  if (!match) return null;

  const [, product, quantity, unitPrice, total] = match;

  return {
    product: product.trim() || null,
    quantity: quantity ? parseNumber(quantity) : null,
    unit_price: unitPrice
      ? parseNumber(unitPrice)
      : null,
    total: total
      ? parseNumber(total)
      : null,
  };
}

function extractInvoiceNumber(
  line: string
): string | null {
  if (!line.includes("رقم الفاتورة")) {
    return null;
  }

  const match = line.match(
    /رقم الفاتورة\s*:\s*([0-9]+)/
  );

  return match?.[1] ?? null;
}

function extractDate(
  line: string
): string | null {
  if (!line.includes("التاريخ")) {
    return null;
  }

  const isoMatch = line.match(
    /\b(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/
  );

  if (isoMatch) {
    const date = isoMatch[0];

    const [year, month, day] =
      date.split("-").map(Number);

    const parsed = new Date(
      year,
      month - 1,
      day
    );

    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return date;
    }
  }

  return null;
}

export function parseNormalizedInvoice(
  normalizedText: string
): Partial<InvoiceData> {
  const lines = normalizedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const items: InvoiceItem[] = [];

  let invoiceNumber: string | null = null;
  let date: string | null = null;
  let total: number | null = null;
  let amountDue: number | null = null;
  let tax: number | null = null;
  let currency: string | null = null;

  for (const line of lines) {

    if (line.startsWith("ITEM |")) {
      const item = parseItemLine(line);

      if (item) {
        items.push(item);
      }

      continue;
    }


    const extractedInvoiceNumber =
      extractInvoiceNumber(line);

    if (extractedInvoiceNumber) {
      invoiceNumber =
        extractedInvoiceNumber;
    }

    const extractedDate =
      extractDate(line);

    if (extractedDate) {
      date = extractedDate;
    }


    if (
      line.includes(
        "الإجمالي المطلوب سداده"
      )
    ) {
      const match = line.match(
        /([\d,.]+)\s*(جنيه|جنبة|جنية|ج\.م|EGP)?/i
      );

      if (match) {
        total = parseNumber(match[1]);

        currency =
          /جنيه|جنبة|جنية|ج\.م/i.test(
            match[2] ?? ""
          )
            ? "EGP"
            : currency;
      }
    }


    if (line.includes("الضريبة")) {
      const match = line.match(
        /([\d,.]+)/
      );

      if (match) {
        tax = parseNumber(match[1]);
      }
    }


    if (line.includes("المستحق")) {
      const match = line.match(
        /([\d,.]+)\s*(جنيه|جنبة|جنية|ج\.م|EGP)?/i
      );

      if (match) {
        amountDue = parseNumber(match[1]);

        if (
          /جنيه|جنبة|جنية|ج\.م/i.test(
            match[2] ?? ""
          )
        ) {
          currency = "EGP";
        }
      }
    }


    if (
      /جنيه|جنبة|جنية|ج\.م/i.test(
        line
      )
    ) {
      currency = "EGP";
    }

    if (/\bUSD\b|\$/i.test(line)) {
      currency = "USD";
    }
  }

  return {
    invoice_number: invoiceNumber,
    supplier: null,
    date,
    items,
    subtotal: null,
    tax,
    discount: null,
    amount_due:
      amountDue ?? total,
    total,
    currency,
  };
}