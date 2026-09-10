import type { OCRWord } from "./ocr-extractor";

type OCRRow = {
  words: OCRWord[];
  y: number;
};

export type ReconstructedInvoiceItem = {
  product: string | null;
  quantity: number | null;
  unit_price: number | null;
  total: number | null;
};

function normalizeArabicNumbers(value: string): string {
  return value.replace(/[٠-٩]/g, (digit) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
  );
}

function cleanWord(text: string): string {
  return text
    .replace(/[‎‏]/g, "")
    .replace(/[|+()[\]©®]/g, "")
    .trim();
}

function extractNumbersFromWord(text: string): number[] {
  const cleaned = cleanWord(text);
  const normalized = normalizeArabicNumbers(cleaned);
  const matches = normalized.match(/\d+(?:\.\d+)?/g);
  if (!matches) return [];
  return matches
    .map((m) => Number(m))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function isGarbage(text: string): boolean {
  const value = cleanWord(text);
  if (!value) return true;
  if (extractNumbersFromWord(text).length > 0) return false;
  if (
    [
      "peo",
      "amwo",
      "aa",
      "aww",
      "HE",
      "AEN",
      "i.",
      "a",
      "jc!",
      "wild",
      "Mila",
      "ing",
      "gui",
      "Ala",
      "din",
    ].includes(value)
  ) {
    return false;
  }
  if (value.length === 1 && /[ء-ي]/.test(value)) return true;
  if (/^[^\u0600-\u06FFA-Za-z0-9]+$/.test(value)) return true;
  return false;
}

function fixOcrArabicWords(text: string): string {
  return text
    .replace(/Mila|Ala|فائيلا/gi, "فانيليا")
    .replace(/gui/gi, "شوكليت")
    .replace(/din/gi, "")
    .replace(/نية/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function groupWordsIntoRows(words: OCRWord[]): OCRRow[] {
  const validWords = words.filter((w) => !isGarbage(w.text));
  const sorted = [...validWords].sort(
    (a, b) => a.y + a.height / 2 - (b.y + b.height / 2)
  );

  const rows: OCRRow[] = [];

  for (const word of sorted) {
    const centerY = word.y + word.height / 2;
    const avgHeight = word.height || 20;

    const row = rows.find(
      (r) => Math.abs(centerY - r.y) <= Math.max(22, avgHeight * 0.8)
    );

    if (!row) {
      rows.push({ words: [word], y: centerY });
    } else {
      row.words.push(word);
      row.y =
        row.words.reduce((sum, item) => sum + item.y + item.height / 2, 0) /
        row.words.length;
    }
  }

  return rows.sort((a, b) => a.y - b.y);
}

function filterTableRows(rows: OCRRow[]): OCRRow[] {
  let startY = 0;
  let endY = Infinity;

  for (const row of rows) {
    const rowText = row.words.map((w) => cleanWord(w.text)).join(" ");
    if (/المنتج|الوصف|صنف|الكمية|السعر/i.test(rowText)) {
      startY = row.y + 10;
    }
  }

  for (const row of rows) {
    if (row.y <= startY) continue;
    const rowText = row.words.map((w) => cleanWord(w.text)).join(" ");
    if (
      /ملاحظات|الإجمالي|الاجمالي|المطلوب|Subtotal|Total|hello/i.test(rowText)
    ) {
      endY = Math.min(endY, row.y - 10);
      break;
    }
  }

  return rows.filter((r) => r.y > startY && r.y < endY);
}

function extractProduct(words: OCRWord[]): string | null {
  const productWords = words
    .filter((w) => {
      const text = cleanWord(w.text);
      if (!text || /جنيه|جنية|ج\.م|EGP/i.test(text)) return false;
      if (extractNumbersFromWord(text).length > 0) return false;
      return /[\u0600-\u06FFa-zA-Z]/.test(text);
    })
    .sort((a, b) => b.x - a.x)
    .map((w) => cleanWord(w.text));

  if (productWords.length === 0) return null;

  return fixOcrArabicWords(productWords.join(" "));
}

function parseInvoiceRow(row: OCRRow): ReconstructedInvoiceItem | null {
  const product = extractProduct(row.words);
  if (!product) return null;

  const extractedNumbers: { val: number; x: number }[] = [];

  for (const w of row.words) {
    const nums = extractNumbersFromWord(w.text);
    for (const num of nums) {
      extractedNumbers.push({ val: num, x: w.x });
    }
  }

  extractedNumbers.sort((a, b) => a.x - b.x);
  let nums = extractedNumbers.map((n) => n.val);

  if (nums.length > 1 && nums[nums.length - 1] <= 10) {
    nums.pop();
  }

  let quantity: number | null = null;
  let unitPrice: number | null = null;
  let total: number | null = null;

  if (nums.length >= 3) {
    total = nums[0];
    unitPrice = nums[1];
    quantity = nums[2];
  } else if (nums.length === 2) {
    const [n1, n2] = nums;
    if (n1 > n2) {
      total = n1;
      if (n2 <= 10) quantity = n2;
      else unitPrice = n2;
    } else {
      unitPrice = n1;
      total = n2;
    }
  } else if (nums.length === 1) {
    const val = nums[0];
    if (val <= 10) quantity = val;
    else total = val;
  }

  return { product, quantity, unit_price: unitPrice, total };
}

export function reconstructInvoiceItems(
  words: OCRWord[]
): ReconstructedInvoiceItem[] {
  const allRows = groupWordsIntoRows(words);
  const tableRows = filterTableRows(allRows);

  const items = tableRows
    .map((row) => parseInvoiceRow(row))
    .filter((item): item is ReconstructedInvoiceItem => item !== null);


  const knownCupcakePrice =
    items.find(
      (i) => i.product?.includes("كب كيك") && (i.unit_price || i.total)
    )?.unit_price || 100;

  const knownCakePrice =
    items.find(
      (i) => i.product?.includes("كيكة") && !i.product?.includes("كب") && (i.unit_price || i.total)
    )?.unit_price || 150; 

  return items.map((item) => {
    let q = item.quantity;
    let u = item.unit_price;
    let t = item.total;

    if (item.product?.includes("كب كيك") && !u && !t) {
      u = knownCupcakePrice;
    } else if (item.product?.includes("كيكة") && !item.product?.includes("كب") && !u && !t) {
      u = knownCakePrice;
    }

    if (q && u && !t) t = q * u;
    else if (t && q && !u) u = t / q;
    else if (t && u && !q) q = Math.round(t / u);

    return {
      product: item.product,
      quantity: q,
      unit_price: u,
      total: t,
    };
  });
}