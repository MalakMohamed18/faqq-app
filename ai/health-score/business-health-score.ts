import type { HealthScore, HealthStatus } from "./business-health-score.types";

type BusinessData = {
  sales?: {
    current: number;
    previous: number;
  };

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

  receivables?: {
    total: number;
  };
};

function getStatus(score: number): HealthStatus {
  if (score >= 90) return "EXCELLENT";
  if (score >= 75) return "GOOD";
  if (score >= 60) return "FAIR";
  if (score >= 40) return "NEEDS_ATTENTION";
  return "CRITICAL";
}

export function calculateBusinessHealthScore(
  data: BusinessData
): HealthScore {
  /*
   * 1. SALES
   * Stable/growing sales = better score
   */
  let salesScore = 70;

  if (data.sales) {
    const { current, previous } = data.sales;

    if (previous > 0) {
      const growth = ((current - previous) / previous) * 100;

      if (growth >= 20) salesScore = 100;
      else if (growth >= 10) salesScore = 90;
      else if (growth >= 0) salesScore = 80;
      else if (growth >= -10) salesScore = 60;
      else salesScore = 40;
    }
  }

  /*
   * 2. INVENTORY
   * Fewer low-stock products = better score
   */
  let inventoryScore = 100;

  if (data.lowStockProducts) {
    const lowStockCount = data.lowStockProducts.length;

    if (lowStockCount === 0) inventoryScore = 100;
    else if (lowStockCount <= 2) inventoryScore = 80;
    else if (lowStockCount <= 5) inventoryScore = 60;
    else inventoryScore = 40;
  }

  /*
   * 3. EXPENSES
   * Lower expense growth = better score
   */
  let expensesScore = 80;

  if (data.expenses && data.expenses.previous > 0) {
    const growth =
      ((data.expenses.current - data.expenses.previous) /
        data.expenses.previous) *
      100;

    if (growth <= 0) expensesScore = 100;
    else if (growth <= 10) expensesScore = 90;
    else if (growth <= 20) expensesScore = 75;
    else if (growth <= 50) expensesScore = 55;
    else expensesScore = 35;
  }

  /*
   * 4. CASH FLOW
   */
  let cashFlowScore = 70;

  if (data.cashFlow) {
    const netCashFlow = data.cashFlow.predicted_net_cash_flow;

    if (netCashFlow > 20000) cashFlowScore = 100;
    else if (netCashFlow > 10000) cashFlowScore = 90;
    else if (netCashFlow > 0) cashFlowScore = 75;
    else cashFlowScore = 30;
  }

  /*
   * 5. RECEIVABLES
   */
  let receivablesScore = 80;

  if (data.receivables) {
    const total = data.receivables.total;

    if (total === 0) receivablesScore = 100;
    else if (total <= 5000) receivablesScore = 85;
    else if (total <= 15000) receivablesScore = 65;
    else receivablesScore = 45;
  }

  /*
   * Weighted overall score
   */
  const score = Math.round(
    salesScore * 0.25 +
      inventoryScore * 0.20 +
      expensesScore * 0.15 +
      cashFlowScore * 0.25 +
      receivablesScore * 0.15
  );

  const strengths: string[] = [];
  const risks: string[] = [];

  if (salesScore >= 80) {
    strengths.push("المبيعات أداءها كويس.");
  } else {
    risks.push("المبيعات محتاجة متابعة.");
  }

  if (inventoryScore >= 80) {
    strengths.push("حالة المخزون مستقرة.");
  } else {
    risks.push("فيه منتجات محتاجة إعادة تخزين.");
  }

  if (expensesScore >= 80) {
    strengths.push("المصاريف تحت السيطرة.");
  } else {
    risks.push("المصاريف زادت و محتاجة مراجعة.");
  }

  if (cashFlowScore >= 80) {
    strengths.push("التدفق النقدي المتوقع إيجابي.");
  } else {
    risks.push("التدفق النقدي محتاج اهتمام.");
  }

  if (receivablesScore >= 80) {
    strengths.push("المبالغ المستحقة من العملاء في مستوى كويس.");
  } else {
    risks.push("فيه مبالغ مستحقة محتاجة تحصيل.");
  }

  return {
    score,
    status: getStatus(score),

    breakdown: {
      sales: salesScore,
      inventory: inventoryScore,
      expenses: expensesScore,
      cashFlow: cashFlowScore,
      receivables: receivablesScore,
    },

    strengths,
    risks,
  };
}