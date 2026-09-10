import {
  getTodaySales,
  getWeeklySales,
  getTopProduct,
  getWeeklyProducts,
  getLowStockProducts,
  getTopReceivable,
  getReceivables,
  getMonthlyExpenses,
  getTopExpense,
  getBusinessInsight,
  getDemandForecast,
  getCashFlowForecast,
} from "./feqqa-tools";

export const TOOL_REGISTRY = {
  getTodaySales,
  getWeeklySales,
  getTopProduct,
  getWeeklyProducts,
  getLowStockProducts,
  getTopReceivable,
  getReceivables,
  getMonthlyExpenses,
  getTopExpense,
  getBusinessInsight,
  getDemandForecast,
  getCashFlowForecast,
} as const;

export type ToolName = keyof typeof TOOL_REGISTRY;