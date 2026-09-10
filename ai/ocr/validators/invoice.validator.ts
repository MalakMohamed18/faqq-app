import type { InvoiceData } from "../schemas/invoice.schema";

const EPSILON = 0.01;

function isClose(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON;
}
function isValidDate(
  date: string | null
): boolean {
  if (!date) return true;

  const match = date.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const parsed = new Date(
    year,
    month - 1,
    day
  );

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}
export function validateInvoiceBusinessRules(
  invoice: InvoiceData
) {
  const warnings: string[] = [];
if (!isValidDate(invoice.date)) {
  warnings.push(
    "Invoice date is invalid"
  );
}

  for (const item of invoice.items) {
    if (
      item.product === null ||
      item.quantity === null ||
      item.unit_price === null ||
      item.total === null
    ) {
      warnings.push(
        `Incomplete invoice item: ${item.product ?? "Unknown product"}`
      );

      continue;
    }

    const expectedTotal =
      item.quantity * item.unit_price;

    if (!isClose(expectedTotal, item.total)) {
      warnings.push(
        `${item.product}: quantity × unit_price does not match total`
      );
    }
  }


  const completeItems = invoice.items.filter(
    (item) =>
      item.total !== null
  );

  const calculatedItemsTotal =
    completeItems.reduce(
      (sum, item) => sum + (item.total ?? 0),
      0
    );


  if (invoice.total === null) {
    warnings.push(
      "Invoice total could not be determined"
    );
  } else if (
    !isClose(
      calculatedItemsTotal,
      invoice.total
    )
  ) {
    warnings.push(
      "Invoice total does not match item totals"
    );
  }


  if (!invoice.currency) {
    warnings.push(
      "Currency could not be determined"
    );
  }


  return {
    valid: warnings.length === 0,
    needs_review: warnings.length > 0,
    warnings,
    calculated_items_total: calculatedItemsTotal,
  };
}