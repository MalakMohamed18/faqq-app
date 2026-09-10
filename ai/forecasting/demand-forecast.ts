import type {
  DailySales,
  DemandForecast,
} from "./types";

const FORECAST_DAYS = 7;
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
  if (historicalDays < 7) {
    return "LOW";
  }

  if (historicalDays < 30) {
    return "MEDIUM";
  }

  return "HIGH";
}

export function forecastDemand(
  product: string,
  sales: DailySales[],
  forecastDays = FORECAST_DAYS,
  window = DEFAULT_WINDOW
): DemandForecast {
  if (!product.trim()) {
    throw new Error("Product name is required");
  }

  if (sales.length === 0) {
    throw new Error("Historical sales data is required");
  }

  const cleanedSales = sales
    .filter(
      (item) =>
        item.date &&
        Number.isFinite(item.quantity) &&
        item.quantity >= 0
    )
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    );

  if (cleanedSales.length === 0) {
    throw new Error("No valid sales data");
  }

  const recentSales = cleanedSales.slice(-window);

  const totalQuantity = recentSales.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const averageDailySales =
    totalQuantity / recentSales.length;

  const lastDate =
    cleanedSales[cleanedSales.length - 1].date;

  const forecast = Array.from(
    { length: forecastDays },
    (_, index) => ({
      date: addDays(lastDate, index + 1),
      predicted_quantity: round(averageDailySales),
    })
  );

  return {
    product,
    historical_days: cleanedSales.length,
    average_daily_sales: round(averageDailySales),
    forecast,
    confidence: calculateConfidence(
      cleanedSales.length
    ),
  };
}