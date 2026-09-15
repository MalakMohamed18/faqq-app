export function getCasualResponse(message: string): string | null {
  const text = message
    .trim()
    .toLowerCase()
    .replace(/[؟?!.,،]/g, "")
    .replace(/\s+/g, " ");

  // شكراً
  if (
    text.includes("شكرا") ||
    text.includes("شكرًا") ||
    text.includes("متشكرة") ||
    text.includes("تسلمي") ||
    text.includes("تسلم")
  ) {
    return "العفو ❤️";
  }

  // تمام
  if (
    text === "تمام" ||
    text === "تمام يا فقة" ||
    text === "تمام يا فقّة" ||
    text === "اوكي" ||
    text === "أوكي" ||
    text === "ماشي"
  ) {
    return "تمام يا ملك ❤️";
  }

  // موافقة
  if (
    text === "اه" ||
    text === "آه" ||
    text === "ايوه" ||
    text === "أيوه"
  ) {
    return "تمام 👌";
  }

  // رفض
  if (
    text === "لا" ||
    text === "لأ" ||
    text === "لاء"
  ) {
    return "تمام، براحتك ❤️";
  }

  // مجاملة
  if (
    text.includes("حلو") ||
    text.includes("جامد") ||
    text.includes("عاش")
  ) {
    return "حبيبتي ❤️";
  }

  return null;
}