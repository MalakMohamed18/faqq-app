import type { IntentResult } from "./schemas/intent.schema";

const INTENT_TO_TOOL = {
  GET_TODAY_SALES: "getTodaySales",
  GET_WEEKLY_SALES: "getWeeklySales",
  GET_TOP_PRODUCT: "getTopProduct",
  GET_WEEKLY_PRODUCTS: "getWeeklyProducts",
  GET_LOW_STOCK: "getLowStockProducts",
  GET_TOP_RECEIVABLE: "getTopReceivable",
  GET_RECEIVABLES: "getReceivables",
  GET_MONTHLY_EXPENSES: "getMonthlyExpenses",
  GET_TOP_EXPENSE: "getTopExpense",
  GET_BUSINESS_INSIGHT: "getBusinessInsight",
  GET_DEMAND_FORECAST: "getDemandForecast",
  GET_CASH_FLOW_FORECAST: "getCashFlowForecast",
  GET_BUSINESS_HEALTH_SCORE: "getBusinessHealthScore",
} as const;

export function routeTool(intentResult: IntentResult) {
  if (!intentResult.intent) {
    return null;
  }

  return INTENT_TO_TOOL[intentResult.intent];
}