import type {
  Recommendation,
  RecommendationSeverity,
} from "./recommendation.types";

type BusinessData = {
  lowStockProducts?: Array<{
    product_name: string;
    current_stock: number;
    minimum_stock: number;
  }>;

  expenses?: {
    current: number;
    previous: number;
  };

  cashFlow?: {
    predicted_net_cash_flow: number;
  };

  sales?: {
    current: number;
    previous: number;
  };
};

function getSeverity(
  level: RecommendationSeverity
): RecommendationSeverity {
  return level;
}

export function generateRecommendations(
  data: BusinessData
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  if (data.lowStockProducts) {
    for (const product of data.lowStockProducts) {
      if (product.current_stock <= product.minimum_stock) {
        recommendations.push({
          type: "LOW_STOCK",
          severity: getSeverity(
            product.current_stock === 0
              ? "CRITICAL"
              : "WARNING"
          ),
          title: "مخزون منخفض",
          message:
            `المنتج ${product.product_name} قرب يخلص، ` +
            `ومتبقي منه ${product.current_stock} وحدة.`,
          action:
            `يفضل تطلب كمية جديدة من ${product.product_name}.`,
        });
      }
    }
  }

  if (
    data.expenses &&
    data.expenses.previous > 0
  ) {
    const increase =
      ((data.expenses.current -
        data.expenses.previous) /
        data.expenses.previous) *
      100;

    if (increase >= 20) {
      recommendations.push({
        type: "HIGH_EXPENSE",
        severity: increase >= 50 ? "CRITICAL" : "WARNING",
        title: "المصاريف زادت",
        message:
          `مصاريفك زادت بنسبة ${increase.toFixed(1)}% ` +
          `مقارنة بالفترة السابقة.`,
        action:
          "راجع المصاريف وحاول تحدد أكتر بند زاد.",
      });
    }
  }

  if (
    data.cashFlow &&
    data.cashFlow.predicted_net_cash_flow < 0
  ) {
    recommendations.push({
      type: "NEGATIVE_CASH_FLOW",
      severity: "CRITICAL",
      title: "تحذير في الكاش فلو",
      message:
        "متوقع إن صافي الكاش فلو يكون بالسالب الفترة الجاية.",
      action:
        "راجع المصاريف والمدفوعات وحاول تزود التحصيل من العملاء.",
    });
  }


  if (
    data.sales &&
    data.sales.previous > 0
  ) {
    const increase =
      ((data.sales.current -
        data.sales.previous) /
        data.sales.previous) *
      100;

    if (increase >= 20) {
      recommendations.push({
        type: "SALES_OPPORTUNITY",
        severity: "INFO",
        title: "فرصة نمو في المبيعات",
        message:
          `المبيعات زادت بنسبة ${increase.toFixed(1)}% ` +
          `مقارنة بالفترة السابقة.`,
        action:
          "حاول تستغل زيادة الطلب وتوفر المنتجات الأكثر مبيعًا.",
      });
    }
  }

  return recommendations;
}