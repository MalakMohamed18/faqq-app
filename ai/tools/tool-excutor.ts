import { TOOL_REGISTRY, type ToolName } from "./tool-registry";
import type { IntentResult } from "../schemas/intent.schema";

export async function executeTool(
  toolName: ToolName,
  intentResult: IntentResult
) {
  const tool = TOOL_REGISTRY[toolName];

  if (!tool) {
    throw new Error(`Tool not found: ${toolName}`);
  }

  const entities = intentResult.entities;

  switch (toolName) {
    case "getTodaySales":
      return await (tool as (date: string) => Promise<any>)(
        entities.date ?? new Date().toISOString().slice(0, 10)
      );

    case "getWeeklySales":
      return await (tool as (start: string, end: string) => Promise<any>)(
        entities.start_date ?? "",
        entities.end_date ?? ""
      );

    case "getTopProduct":
    case "getWeeklyProducts":
    case "getLowStockProducts":
    case "getTopReceivable":
    case "getReceivables":
    case "getTopExpense":
    case "getBusinessInsight":
      return await (tool as () => Promise<any>)();

    case "getMonthlyExpenses":
  return await (tool as (period: string) => Promise<any>)(
    entities.period ?? ""
  );

case "getDemandForecast":
  return await (tool as (
    product: string,
    period: string | null
  ) => Promise<any>)(
    entities.product ?? "Unknown Product",
    entities.period ?? null
  );
  case "getCashFlowForecast":
  return await (tool as (
    period: string | null
  ) => Promise<any>)(
    entities.period ?? null
  );

default:
  throw new Error(`Unsupported tool: ${toolName}`);

  }
}
