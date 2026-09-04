export function mockLLMResponse(userMessage: string) {
  if (
    userMessage.includes("بعت") ||
    userMessage.includes("مبيعات") ||
    userMessage.includes("النهارده")
  ) {
    return {
      intent: "GET_TODAY_SALES",
      entities: {
        date: "today",
        start_date: null,
        end_date: null,
        period: null,
        product: null,
        customer: null,
      },
      confidence: 0.99,
    };
  }

  return {
    intent: null,
    entities: {
      date: null,
      start_date: null,
      end_date: null,
      period: null,
      product: null,
      customer: null,
    },
    confidence: 0.2,
  };
}