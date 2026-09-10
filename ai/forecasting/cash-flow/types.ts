export type DailyCashFlow = {
  date: string;
  cash_in: number;
  cash_out: number;
};

export type CashFlowForecast = {
  historical_days: number;

  average_daily_inflow: number;
  average_daily_outflow: number;
  average_daily_net_cash_flow: number;

  forecast: {
    date: string;
    predicted_cash_in: number;
    predicted_cash_out: number;
    predicted_net_cash_flow: number;
  }[];

  total_predicted_inflow: number;
  total_predicted_outflow: number;
  total_predicted_net_cash_flow: number;

  confidence: "LOW" | "MEDIUM" | "HIGH";
};