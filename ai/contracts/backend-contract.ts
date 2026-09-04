// ========================================
// Feqqa AI ↔ Backend Contracts
// ========================================

export type GetTodaySalesRequest = {
  date: string;
};

export type GetTodaySalesResponse = {
  date: string;
  total_sales: number;
  transactions_count: number;
  currency: string;
};


// ========================================
// Weekly Sales
// ========================================

export type GetWeeklySalesRequest = {
  start_date: string;
  end_date: string;
};

export type GetWeeklySalesResponse = {
  start_date: string;
  end_date: string;
  total_sales: number;
  transactions_count: number;
  currency: string;
};


// ========================================
// Low Stock
// ========================================

export type GetLowStockResponse = {
  products: {
    product_name: string;
    current_stock: number;
    minimum_stock: number;
  }[];
};


// ========================================
// Receivables
// ========================================

export type GetReceivablesResponse = {
  customers: {
    customer_name: string;
    amount: number;
    currency: string;
  }[];
};


// ========================================
// Monthly Expenses
// ========================================

export type GetMonthlyExpensesRequest = {
  month: string;
};

export type GetMonthlyExpensesResponse = {
  month: string;
  total_expenses: number;
  currency: string;
};