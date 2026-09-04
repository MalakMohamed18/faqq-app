import type { IntentResult } from "./schemas/intent.schema";

const MIN_CONFIDENCE = 0.7;

export function checkConfidence(result: IntentResult) {
  if (result.confidence < MIN_CONFIDENCE) {
    return {
      approved: false,
      reason: "LOW_CONFIDENCE",
      message: "مش فاهم السؤال بشكل كافي، ممكن توضحي أكتر؟",
    };
  }

  if (!result.intent) {
    return {
      approved: false,
      reason: "NO_INTENT",
      message: "مش قادر أحدد المطلوب من السؤال.",
    };
  }

  return {
    approved: true,
    reason: "OK",
    message: null,
  };
}