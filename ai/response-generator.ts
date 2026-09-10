type ToolData = any;

type Recommendation = {
  type: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
  action: string;
};

export async function generateResponse(
  userMessage: string,
  toolName: string,
  toolData: unknown,
  recommendations: Recommendation[] = []
): Promise<string> {

  console.log("\n Generating Final Response...");

  const data = toolData as ToolData;

  if (toolName === "getBusinessInsight") {

    let response = `ملخص شغلك: ${data.insight}`;

    if (recommendations.length > 0) {
      response += "\n\n أهم التنبيهات والتوصيات:\n";

      response += recommendations
        .map((recommendation) => {
          const icon =
            recommendation.severity === "CRITICAL"
              ? "🔴"
              : recommendation.severity === "WARNING"
              ? "🟠"
              : "🟢";

          return (
            `${icon} ${recommendation.title}\n` +
            `${recommendation.message}\n` +
            ` ${recommendation.action}`
          );
        })
        .join("\n\n");
    }

    return response;
  }

  switch (toolName) {
    case "getTodaySales":
      return `النهارده مبيعاتك ${data.total_sales} جنيه `;

    case "getWeeklySales":
      return `مبيعاتك الأسبوع ده ${data.total_sales} جنيه `;

    case "getTopProduct":
      return `أكتر منتج اتباع هو ${data.product_name}، بإجمالي ${data.quantity_sold}.`;

    case "getWeeklyProducts":
      if (!Array.isArray(data) || data.length === 0) {
        return "مفيش منتجات مباعة الأسبوع ده.";
      }

      return (
        `المنتجات اللي بعتها الأسبوع ده:\n` +
        data
          .map(
            (item: any) =>
              `• ${item.product_name}: ${item.quantity_sold}`
          )
          .join("\n")
      );

    case "getLowStockProducts":
      if (!Array.isArray(data) || data.length === 0) {
        return "مفيش منتجات قربت تخلص حاليًا ";
      }

      return (
        `المنتجات اللي قربت تخلص:\n` +
        data
          .map(
            (item: any) =>
              `• ${item.product_name}: ${item.current_stock} متبقي`
          )
          .join("\n")
      );

    case "getTopReceivable":
      return `أكتر عميل عليه فلوس هو ${data.customer_name} بـ ${data.amount} جنيه.`;

    case "getReceivables":
      if (!Array.isArray(data) || data.length === 0) {
        return "مفيش عملاء عليهم فلوس حاليًا ";
      }

      return (
        `العملاء اللي عليهم فلوس:\n` +
        data
          .map(
            (item: any) =>
              `• ${item.customer_name}: ${item.amount} جنيه`
          )
          .join("\n")
      );

    case "getMonthlyExpenses":
      return `مصاريفك الشهر ده ${data.total_expenses} جنيه.`;

    case "getTopExpense":
      return `أكتر مصروف عندك هو ${data.expense_name} بـ ${data.amount} جنيه.`;

    case "getCashFlowForecast":
      return (
        `متوقع الأسبوع الجاي يدخل عندك حوالي ${Number(
          data.total_predicted_inflow
        ).toLocaleString("en-US")} جنيه، ` +
        `ويخرج حوالي ${Number(
          data.total_predicted_outflow
        ).toLocaleString("en-US")} جنيه.\n` +
        `يعني صافي الكاش المتوقع حوالي ${Number(
          data.total_predicted_net_cash_flow
        ).toLocaleString("en-US")} جنيه `
      );

    default:
      return "مش قادر أطلعلك النتيجة دلوقتي.";
  }
}