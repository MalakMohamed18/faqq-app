export type DailySales = {
  date: string;
  quantity: number;
};

export type DemandForecast = {
  product: string;
  historical_days: number;
  average_daily_sales: number;
  forecast: {
    date: string;
    predicted_quantity: number;
  }[];
  confidence: "LOW" | "MEDIUM" | "HIGH";
};