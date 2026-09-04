export function mockGenerateResponse(
  userMessage: string,
  toolName: string,
  toolData: any
) {
  if (toolName === "getTodaySales") {
    return` مبيعاتك النهارده وصلت لـ ${toolData.total_sales.toLocaleString()} ${toolData.currency} 💰 من خلال ${toolData.transactions_count} عملية بيع.;`
  }

  return "معنديش بيانات كافية أقدر أجاوب بيها على السؤال ده.";
}