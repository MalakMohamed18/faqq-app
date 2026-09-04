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
} as const;

export type ToolName = keyof typeof TOOL_REGISTRY;