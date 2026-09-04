import type { InvoiceData } from "../schemas/invoice.schema";

const EPSILON = 0.01;

function isClose(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON;
}

export function validateInvoiceBusinessRules(invoice: InvoiceData) {
  const warnings: string[] = [];

  for (const item of invoice.items) {
    const expectedTotal = item.quantity * item.unit_price;

    if (!isClose(expectedTotal, item.total)) {
      warnings.push(
        `${item.product}: quantity × unit_price does not match total`
      );
    }
  }

  const calculatedInvoiceTotal = invoice.items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  if (!isClose(calculatedInvoiceTotal, invoice.total)) {
    warnings.push(
      `Invoice total does not match the sum of item totals`
    );
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}