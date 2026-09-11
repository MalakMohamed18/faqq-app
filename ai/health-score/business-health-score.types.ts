export type HealthStatus =
  | "EXCELLENT"
  | "GOOD"
  | "FAIR"
  | "NEEDS_ATTENTION"
  | "CRITICAL";

export type HealthScore = {
  score: number;
  status: HealthStatus;

  breakdown: {
    sales: number;
    inventory: number;
    expenses: number;
    cashFlow: number;
    receivables: number;
  };

  strengths: string[];
  risks: string[];
};