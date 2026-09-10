import { forecastDemand } from "../forecasting/demand-forecast";
import { forecastCashFlow } from "../forecasting/cash-flow/cash-flow-forecast";
export type SalesResult = {
  date: string;
  total_sales: number;
  transactions_count: number;
  currency: string;
};

export type WeeklySalesResult = {
  start_date: string;
  end_date: string;
  total_sales: number;
  transactions_count: number;
  currency: string;
};

export type ProductResult = {
  product_name: string;
  quantity_sold: number;
  revenue: number;
  currency: string;
};

export type LowStockProduct = {
  product_name: string;
  current_stock: number;
  minimum_stock: number;
};

export type Receivable = {
  customer_name: string;
  amount: number;
  currency: string;
};

export type ExpenseResult = {
  month: string;
  total_expenses: number;
  currency: string;
};

export type TopExpenseResult = {
  expense_name: string;
  amount: number;
  currency: string;
};

export async function getTodaySales(
  date: string
): Promise<SalesResult> {
  return {
    date,
    total_sales: 8500,
    transactions_count: 42,
    currency: "EGP",
  };
}


export async function getWeeklySales(
  startDate: string,
  endDate: string
): Promise<WeeklySalesResult> {
  return {
    start_date: startDate,
    end_date: endDate,
    total_sales: 52500,
    transactions_count: 267,
    currency: "EGP",
  };
}


export async function getTopProduct(): Promise<ProductResult> {
  return {
    product_name: "Pepsi Can",
    quantity_sold: 120,
    revenue: 3600,
    currency: "EGP",
  };
}

export async function getWeeklyProducts(): Promise<ProductResult[]> {
  return [
    {
      product_name: "Pepsi Can",
      quantity_sold: 120,
      revenue: 3600,
      currency: "EGP",
    },
    {
      product_name: "Chips",
      quantity_sold: 95,
      revenue: 2375,
      currency: "EGP",
    },
    {
      product_name: "Juice",
      quantity_sold: 80,
      revenue: 2400,
      currency: "EGP",
    },
  ];
}


export async function getLowStockProducts(): Promise<
  LowStockProduct[]
> {
  return [
    {
      product_name: "Pepsi Can",
      current_stock: 8,
      minimum_stock: 20,
    },
    {
      product_name: "Chips",
      current_stock: 5,
      minimum_stock: 15,
    },
  ];
}

export async function getTopReceivable(): Promise<Receivable> {
  return {
    customer_name: "Ahmed Mohamed",
    amount: 4500,
    currency: "EGP",
  };
}


export async function getReceivables(): Promise<Receivable[]> {
  return [
    {
      customer_name: "Ahmed Mohamed",
      amount: 4500,
      currency: "EGP",
    },
    {
      customer_name: "Mahmoud Ali",
      amount: 2800,
      currency: "EGP",
    },
    {
      customer_name: "Sara Hassan",
      amount: 1500,
      currency: "EGP",
    },
  ];
}


export async function getMonthlyExpenses(
  month: string
): Promise<ExpenseResult> {
  return {
    month,
    total_expenses: 18500,
    currency: "EGP",
  };
}


export async function getTopExpense(): Promise<TopExpenseResult> {
  return {
    expense_name: "Shop Rent",
    amount: 8000,
    currency: "EGP",
  };
}

export async function getBusinessInsight() {
  return {
    insight:
      "المبيعات مستقرة لكن فيه منتجات قربت تخلص ومبالغ متأخرة عند العملاء.",
    priority: "medium",
    related_areas: [
      "inventory",
      "receivables",
      "sales",
    ],
  };
}
export async function getDemandForecast(
  product: string,
  period: string | null = null
) {
  const sales = [
    { date: "2026-08-25", quantity: 10 },
    { date: "2026-08-26", quantity: 12 },
    { date: "2026-08-27", quantity: 8 },
    { date: "2026-08-28", quantity: 15 },
    { date: "2026-08-29", quantity: 11 },
    { date: "2026-08-30", quantity: 14 },
    { date: "2026-08-31", quantity: 13 },
  ];

  const forecastDays =
    period === "next_month" ? 30 : 7;

  return forecastDemand(
    product,
    sales,
    forecastDays
  );
}
export async function getCashFlowForecast(
  period: string | null = null
) {
  const cashFlow = [
    {
      date: "2026-08-25",
      cash_in: 5000,
      cash_out: 3000,
    },
    {
      date: "2026-08-26",
      cash_in: 5500,
      cash_out: 3200,
    },
    {
      date: "2026-08-27",
      cash_in: 4800,
      cash_out: 2800,
    },
    {
      date: "2026-08-28",
      cash_in: 6200,
      cash_out: 3500,
    },
    {
      date: "2026-08-29",
      cash_in: 5100,
      cash_out: 3100,
    },
    {
      date: "2026-08-30",
      cash_in: 5800,
      cash_out: 3300,
    },
    {
      date: "2026-08-31",
      cash_in: 5400,
      cash_out: 3000,
    },
  ];

  const forecastDays =
    period === "next_month" ? 30 : 7;

  return forecastCashFlow(
    cashFlow,
    forecastDays
  );
}