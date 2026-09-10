import type {
  CashFlowForecast,
  DailyCashFlow,
} from "./types";

const DEFAULT_FORECAST_DAYS = 7;
const DEFAULT_WINDOW = 7;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);

  const result = new Date(
    Date.UTC(year, month - 1, day + days)
  );

  return [
    result.getUTCFullYear(),
    String(result.getUTCMonth() + 1).padStart(2, "0"),
    String(result.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function calculateConfidence(
  historicalDays: number
): "LOW" | "MEDIUM" | "HIGH" {
  if (historicalDays < 7) return "LOW";
  if (historicalDays < 30) return "MEDIUM";
  return "HIGH";
}

export function forecastCashFlow(
  sales: DailyCashFlow[],
  forecastDays = DEFAULT_FORECAST_DAYS,
  window = DEFAULT_WINDOW
): CashFlowForecast {
  if (sales.length === 0) {
    throw new Error("Historical cash flow data is required");
  }

  if (forecastDays <= 0) {
    throw new Error("Forecast days must be greater than zero");
  }

  const cleanedData = sales
    .filter(
      (item) =>
        item.date &&
        Number.isFinite(item.cash_in) &&
        Number.isFinite(item.cash_out) &&
        item.cash_in >= 0 &&
        item.cash_out >= 0
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  if (cleanedData.length === 0) {
    throw new Error("No valid cash flow data");
  }

  const recentData = cleanedData.slice(-window);

  const totalInflow = recentData.reduce(
    (sum, item) => sum + item.cash_in,
    0
  );

  const totalOutflow = recentData.reduce(
    (sum, item) => sum + item.cash_out,
    0
  );

  const averageDailyInflow =
    totalInflow / recentData.length;

  const averageDailyOutflow =
    totalOutflow / recentData.length;

  const averageDailyNetCashFlow =
    averageDailyInflow - averageDailyOutflow;

  const lastDate =
    cleanedData[cleanedData.length - 1].date;

  const forecast = Array.from(
    { length: forecastDays },
    (_, index) => {
      const predictedCashIn = round(
        averageDailyInflow
      );

      const predictedCashOut = round(
        averageDailyOutflow
      );

      const predictedNetCashFlow = round(
        predictedCashIn - predictedCashOut
      );

      return {
        date: addDays(lastDate, index + 1),
        predicted_cash_in: predictedCashIn,
        predicted_cash_out: predictedCashOut,
        predicted_net_cash_flow: predictedNetCashFlow,
      };
    }
  );

  const totalPredictedInflow = forecast.reduce(
    (sum, item) => sum + item.predicted_cash_in,
    0
  );

  const totalPredictedOutflow = forecast.reduce(
    (sum, item) => sum + item.predicted_cash_out,
    0
  );

  const totalPredictedNetCashFlow =
    totalPredictedInflow - totalPredictedOutflow;

  return {
    historical_days: cleanedData.length,

    average_daily_inflow: round(
      averageDailyInflow
    ),

    average_daily_outflow: round(
      averageDailyOutflow
    ),

    average_daily_net_cash_flow: round(
      averageDailyNetCashFlow
    ),

    forecast,

    total_predicted_inflow: round(
      totalPredictedInflow
    ),

    total_predicted_outflow: round(
      totalPredictedOutflow
    ),

    total_predicted_net_cash_flow: round(
      totalPredictedNetCashFlow
    ),

    confidence: calculateConfidence(
      cleanedData.length
    ),
  };
}