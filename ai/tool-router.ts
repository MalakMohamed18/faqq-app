import type { IntentResult } from "./schemas/intent.schema";
import { TOOL_REGISTRY, type ToolName } from "./tools/tool-registry";

const INTENT_TO_TOOL: Record<string, ToolName> = {
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
};

export function routeTool(
  intentResult: IntentResult
): ToolName | null {
  if (!intentResult.intent) {
    return null;
  }

  return INTENT_TO_TOOL[intentResult.intent] ?? null;
}

export function getToolFunction(toolName: ToolName) {
  return TOOL_REGISTRY[toolName];
}