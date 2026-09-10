export function normalizeOCRText(
  rawText: string
): string {
  let text = rawText;

  text = text.replace(/\r\n/g, "\n");

  text = text.replace(
    /[\u061C\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g,
    ""
  );

  text = text.normalize("NFKC");

  text = text.replace(/[|]/g, " ");

  text = text
    .replace(/[ \t]+/g, " ")
    .trim();

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const normalizedLines: string[] = [];

  for (const line of lines) {
    const current = line
      .replace(/\s+/g, " ")
      .trim();

    if (
      current === "." ||
      current === ":" ||
      current.length <= 2
    ) {
      continue;
    }
    if (
      /رقم الفاتورة|رقم فاتورة|invoice\s*(number|no\.?|#)/i.test(
        current
      )
    ) {
      normalizedLines.push(current);
      continue;
    }

    if (
      /التاريخ|تاريخ الإصدار|تاريخ الاصدار|\bdate\b/i.test(
        current
      )
    ) {
      normalizedLines.push(current);
      continue;
    }

    if (
      /الإجمالي المطلوب سداده|الإجمالي|المبلغ الإجمالي|المستحق|total|amount due/i.test(
        current
      )
    ) {
      normalizedLines.push(current);
      continue;
    }

    if (/الضريبة|tax/i.test(current)) {
      normalizedLines.push(current);
      continue;
    }

    if (/الخصم|discount/i.test(current)) {
      normalizedLines.push(current);
      continue;
    }

    if (
      /جنيه|جنية|ج\.م|EGP|USD|\$/i.test(current)
    ) {
      normalizedLines.push(current);
      continue;
    }

    if (current.length > 2) {
      normalizedLines.push(current);
    }
  }

  return normalizedLines.join("\n");
}