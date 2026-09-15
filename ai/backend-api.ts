const BASE_URL =
  process.env.BACKEND_URL ?? "http://localhost:3000/api";
export type BackendResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type BackendRequestOptions = {
  token: string;
};

async function request<T>(
  endpoint: string,
  options: BackendRequestOptions,
): Promise<BackendResponse<T>> {
  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${options.token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Backend API error ${response.status}: ${errorText}`,
    );
  }

  return response.json() as Promise<
    BackendResponse<T>
  >;
}

/* =====================================================
   SALES
===================================================== */

export type BackendSalesProduct = {
  product_id?: string;
  product_name: string;
  quantity_sold: number;
  sales_amount: number;
};

export type BackendSalesData = {
  start_date: string;
  end_date: string;
  total_sales: number;
  transactions_count: number;
  currency: string;
  products: BackendSalesProduct[];
};

export async function getSalesFromBackend(
  token: string,
  startDate?: string,
  endDate?: string,
) {
  const params =
    new URLSearchParams();

  if (startDate) {
    params.set(
      "start_date",
      startDate,
    );
  }

  if (endDate) {
    params.set(
      "end_date",
      endDate,
    );
  }

  const query =
    params.toString();

  return request<BackendSalesData>(
    `/ai-data/sales${
      query ? `?${query}` : ""
    }`,
    { token },
  );
}

export async function getTodaySalesFromBackend(
  token: string,
) {
  return request<{
    date: string;
    total_sales: number;
    transactions_count: number;
    currency: string;
  }>("/sales/today", { token });
}

/* =====================================================
   INVENTORY
===================================================== */

export async function getLowStockFromBackend(
  token: string,
) {
  return request<{
    products: {
      product_id?: string;
      product_name: string;
      current_stock: number;
      minimum_stock: number;
    }[];
  }>(
    "/ai-data/inventory/low-stock",
    { token },
  );
}

/* =====================================================
   RECEIVABLES
===================================================== */

export async function getReceivablesFromBackend(
  token: string,
) {
  return request<{
    customers: {
      customer_id?: string;
      customer_name: string;
      amount: number;
      outstanding_amount?: number;
      due_date?: string;
    }[];
  }>(
    "/ai-data/receivables",
    { token },
  );
}

/* =====================================================
   EXPENSES
===================================================== */

export async function getExpensesFromBackend(
  token: string,
  month?: string,
) {
  const currentMonth =
    month ??
    new Date()
      .toISOString()
      .slice(0, 7);

  return request<{
    month: string;
    total_expenses: number;
    previous_period_expenses: number;
    currency: string;
    categories: {
      category: string;
      amount: number;
    }[];
  }>(
    `/ai-data/expenses?month=${currentMonth}`,
    { token },
  );
}

/* =====================================================
   CASH FLOW
===================================================== */

export async function getCashFlowHistoricalFromBackend(
  token: string,
  days: number = 30,
) {
  return request<{
    period_days: number;
    start_date: string;
    end_date: string;
    current_cash_balance: number;
    total_sales: number;
    total_expenses: number;
    expected_receivables_7d: number;
    expected_expenses_7d: number;
    currency: string;
  }>(
    `/ai-data/cashflow/historical?days=${days}`,
    { token },
  );
}