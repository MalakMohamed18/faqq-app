import {
  TOOL_REGISTRY,
  type ToolName,
} from "./tool-registry";

import type { IntentResult } from "../schemas/intent.schema";

export async function executeTool(
  toolName: ToolName,
  intentResult: IntentResult,
  accessToken?: string,
) {
  const tool = TOOL_REGISTRY[toolName];

  if (!tool) {
    throw new Error(
      `Tool not found: ${toolName}`,
    );
  }

  const entities = intentResult.entities;

  switch (toolName) {
    case "getTodaySales": {
      return await (
        tool as (
          date: string,
          token?: string,
        ) => Promise<any>
      )(
        entities.date ??
          new Date()
            .toISOString()
            .slice(0, 10),
        accessToken,
      );
    }

    case "getWeeklySales": {
      return await (
        tool as (
          start?: string,
          end?: string,
          token?: string,
        ) => Promise<any>
      )(
        entities.start_date ?? undefined,
        entities.end_date ?? undefined,
        accessToken,
      );
    }

    case "getTopProduct": {
      return await (
        tool as (
          token?: string,
        ) => Promise<any>
      )(accessToken);
    }

    case "getWeeklyProducts": {
      return await (
        tool as (
          token?: string,
        ) => Promise<any>
      )(accessToken);
    }

    case "getLowStockProducts": {
      return await (
        tool as (
          token?: string,
        ) => Promise<any>
      )(accessToken);
    }

    case "getTopReceivable": {
      return await (
        tool as (
          token?: string,
        ) => Promise<any>
      )(accessToken);
    }

    case "getReceivables": {
      return await (
        tool as (
          token?: string,
        ) => Promise<any>
      )(accessToken);
    }

    case "getMonthlyExpenses": {
      return await (
        tool as (
          period?: string,
          token?: string,
        ) => Promise<any>
      )(
        entities.period ?? undefined,
        accessToken,
      );
    }

    case "getTopExpense": {
      return await (
        tool as (
          token?: string,
        ) => Promise<any>
      )(accessToken);
    }

    case "getBusinessInsight": {
      return await (
        tool as (
          token?: string,
        ) => Promise<any>
      )(accessToken);
    }

    case "getDemandForecast": {
      return await (
        tool as (
          product: string,
          period?: string,
          token?: string,
        ) => Promise<any>
      )(
        entities.product ?? "Unknown Product",
        entities.period ?? undefined,
        accessToken,
      );
    }

    case "getCashFlowForecast": {
      return await (
        tool as (
          period?: string,
          token?: string,
        ) => Promise<any>
      )(
        entities.period ?? undefined,
        accessToken,
      );
    }

    case "getBusinessHealthScore": {
      return await (
        tool as (
          token?: string,
        ) => Promise<any>
      )(accessToken);
    }

    default:
      throw new Error(
        `Unsupported tool: ${toolName}`,
      );
  }
}
