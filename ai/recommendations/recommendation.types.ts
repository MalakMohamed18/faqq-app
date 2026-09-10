export type RecommendationType =
  | "LOW_STOCK"
  | "HIGH_EXPENSE"
  | "NEGATIVE_CASH_FLOW"
  | "SALES_OPPORTUNITY";

export type RecommendationSeverity =
  | "INFO"
  | "WARNING"
  | "CRITICAL";

export type Recommendation = {
  type: RecommendationType;
  severity: RecommendationSeverity;
  title: string;
  message: string;
  action: string;
};