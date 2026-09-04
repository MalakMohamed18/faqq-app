// ========================================
// Feqqa AI Tools
// ========================================

// ---------- Types ----------

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

// ========================================
// 1. Today's Sales
// ========================================

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

// ========================================
// 2. Weekly Sales
// ========================================

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

// ========================================
// 3. Top Product
// ========================================

export async function getTopProduct(): Promise<ProductResult> {
  return {
    product_name: "Pepsi Can",
    quantity_sold: 120,
    revenue: 3600,
    currency: "EGP",
  };
}

// ========================================
// 4. Weekly Products
// ========================================

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

// ========================================
// 5. Low Stock Products
// ========================================

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

// ========================================
// 6. Top Receivable
// ========================================

export async function getTopReceivable(): Promise<Receivable> {
  return {
    customer_name: "Ahmed Mohamed",
    amount: 4500,
    currency: "EGP",
  };
}

// ========================================
// 7. All Receivables
// ========================================

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

// ========================================
// 8. Monthly Expenses
// ========================================

export async function getMonthlyExpenses(
  month: string
): Promise<ExpenseResult> {
  return {
    month,
    total_expenses: 18500,
    currency: "EGP",
  };
}

// ========================================
// 9. Top Expense
// ========================================

export async function getTopExpense(): Promise<TopExpenseResult> {
  return {
    expense_name: "Shop Rent",
    amount: 8000,
    currency: "EGP",
  };
}
// ========================================
// 10. Business Insight
// ========================================

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