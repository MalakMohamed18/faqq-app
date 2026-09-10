const INVOICE_KEYWORDS = [
  "invoice",
  "فاتورة",
  "مبيعات",
  "العميل",
  "التاريخ",
  "الإجمالي",
  "المبلغ",
  "الكمية",
  "السعر",
  "رقم",
];

export function checkPDFTextQuality(text: string) {
  const cleaned = text
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length < 30) {
    return {
      usable: false,
      score: 0,
      reason: "TEXT_TOO_SHORT",
    };
  }

  let score = 0;

  const numbers = cleaned.match(/\d+/g) ?? [];

  if (numbers.length >= 3) {
    score += 30;
  }

  const lowerText = cleaned.toLowerCase();

  const matchedKeywords = INVOICE_KEYWORDS.filter(
    (keyword) =>
      lowerText.includes(keyword.toLowerCase())
  );

  score += Math.min(
    matchedKeywords.length * 10,
    50
  );
  if (lowerText.includes("invoice")) {
    score += 20;
  }

  return {
    usable: score >= 40,
    score,
    reason:
      score >= 40
        ? "TEXT_USABLE"
        : "TEXT_QUALITY_TOO_LOW",
    matchedKeywords,
  };
}