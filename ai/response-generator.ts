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
      response += "\n\nأهم التنبيهات والتوصيات:\n";

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
            `${recommendation.action}`
          );
        })
        .join("\n\n");
    }

    return response;
  }

  switch (toolName) {
    case "getTodaySales":
      return `النهارده مبيعاتك ${data.total_sales} جنيه`;

    case "getWeeklySales":
      return `مبيعاتك الأسبوع ده ${data.total_sales} جنيه`;

    case "getTopProduct":
      if (
        !data ||
        data.product_name === "لا يوجد" ||
        Number(data.quantity_sold ?? 0) <= 0
      ) {
        return "مفيش منتجات مباعة الأسبوع ده.";
      }

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
        return "مفيش منتجات قربت تخلص حاليًا";
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
      if (
        !data ||
        data.customer_name === "لا يوجد" ||
        Number(data.amount ?? 0) <= 0
      ) {
        return "مفيش عملاء عليهم فلوس حاليًا";
      }

      return `أكتر عميل عليه فلوس هو ${data.customer_name} بـ ${data.amount} جنيه.`;

    case "getReceivables":
      if (!Array.isArray(data) || data.length === 0) {
        return "مفيش عملاء عليهم فلوس حاليًا";
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
      if (
        !data ||
        data.expense_name === "لا يوجد" ||
        Number(data.amount ?? 0) <= 0
      ) {
        return "مفيش مصروفات مسجلة الشهر ده حاليًا";
      }

      return `أكتر مصروف عندك هو ${data.expense_name} بـ ${data.amount} جنيه.`;


case "getDemandForecast": {
  const productName = data.product_name ?? "المنتج";

  const hasHistoricalData =
    data.has_historical_data !== false;

  if (!hasHistoricalData) {
    return `📦 مقدرش أتوقع الطلب على ${productName} لسه، لأن مفيش بيانات مبيعات كفاية عنه في آخر ${data.source_period?.period_days ?? 30} يوم.`;
  }

  const predictedQuantity =
    Number(data.predicted_quantity ?? 0);

  const averageDailyDemand =
    Number(data.average_daily_demand ?? 0);

  const historicalQuantity =
    Number(data.historical_quantity ?? 0);

  const forecastDays =
    Number(data.forecast_days ?? 7);

  let response =
    `📦 توقع الطلب على ${productName}:\n\n`;

  response +=
    `🔮 متوقع تبيع حوالي ${predictedQuantity} وحدة خلال ${forecastDays} أيام.\n`;

  response +=
    `📊 متوسط البيع اليومي: ${averageDailyDemand} وحدة.\n`;

  response +=
    `📈 المبيعات خلال آخر ${data.source_period?.period_days ?? 30} يوم: ${historicalQuantity} وحدة.`;

  if (predictedQuantity > 0) {
    response +=
      `\n\n💡 لو هتجهز مخزون للأسبوع الجاي، خليك مستعد لحوالي ${predictedQuantity} وحدة.`;
  }

  return response;
}

case "getCashFlowForecast": {

  const inflow =
    Number(data.predicted_inflow ?? 0);

  const outflow =
    Number(data.predicted_outflow ?? 0);

  const netCashFlow =
    Number(
      data.predicted_net_cash_flow ?? 0,
    );

  const predictedBalance =
    Number(
      data.predicted_cash_balance ?? 0,
    );

  const predictedSales =
    Number(
      data.breakdown?.predicted_sales ?? 0,
    );

  const receivables =
    Number(
      data.breakdown?.expected_receivables ?? 0,
    );

  const expenses =
    Number(
      data.breakdown?.expected_expenses ?? 0,
    );


  const formatMoney = (value: number) =>
    value.toLocaleString("en-US");


  let response =
    `📊 توقع الكاش للأسبوع الجاي:\n\n`;

  response +=
    `💰 المتوقع يدخل: ${formatMoney(inflow)} جنيه\n`;

  response +=
    `📤 المتوقع يخرج: ${formatMoney(outflow)} جنيه\n`;

  response +=
    `📈 صافي التدفق المتوقع: ${formatMoney(netCashFlow)} جنيه\n`;

  response +=
    `💵 الرصيد المتوقع: ${formatMoney(predictedBalance)} جنيه`;


  response +=
    `\n\nالتفصيل:\n`;

  response +=
    `• مبيعات متوقعة: ${formatMoney(predictedSales)} جنيه\n`;

  response +=
    `• مستحقات متوقعة: ${formatMoney(receivables)} جنيه\n`;

  response +=
    `• مصاريف متوقعة: ${formatMoney(expenses)} جنيه`;


  if (netCashFlow > 0) {

    response +=
      `\n\n🟢 التوقع إيجابي، الكاش متوقع يزيد حوالي ${formatMoney(netCashFlow)} جنيه.`;

  } else if (netCashFlow < 0) {

    response +=
      `\n\n🔴 خدي بالك، الكاش متوقع ينخفض حوالي ${formatMoney(Math.abs(netCashFlow))} جنيه.`;

  } else {

    response +=
      `\n\n🟠 المتوقع إن التدفق النقدي يكون مستقر تقريبًا.`;
  }


  return response;
}

    case "getBusinessHealthScore": {
      const statusMap: Record<string, string> = {
        EXCELLENT: "ممتاز جدًا 🟢",
        GOOD: "كويس 🟢",
        FAIR: "متوسط 🟠",
        WEAK: "محتاج اهتمام 🔴",
        POOR: "محتاج اهتمام 🔴",
        CRITICAL: "حرج جدًا 🔴",
      };

      let response = `🏥 حالة البيزنس: ${
        statusMap[data.status] ?? data.status
      }\n`;

      response += `📊 الـ Health Score: ${data.score}/100\n\n`;

      response += `📈 التقييم بالتفصيل:\n`;

      response += `• المبيعات: ${data.breakdown.sales}/100\n`;
      response += `• المخزون: ${data.breakdown.inventory}/100\n`;
      response += `• المصاريف: ${data.breakdown.expenses}/100\n`;
      response += `• التدفق النقدي: ${data.breakdown.cashFlow}/100\n`;
      response += `• العملاء المستحق عليهم: ${data.breakdown.receivables}/100\n`;

      if (data.strengths?.length > 0) {
        response += `\n💪 نقاط القوة:\n`;

        response += data.strengths
          .map((item: string) => `• ${item}`)
          .join("\n");
      }

      if (data.risks?.length > 0) {
        response += `\n\n⚠️ محتاج تركز على:\n`;

        response += data.risks
          .map((item: string) => `• ${item}`)
          .join("\n");
      }

      return response;
    }

    default:
      return "مش قادر أطلعلك النتيجة دلوقتي.";
  }
}
