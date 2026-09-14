import {
  getTodaySalesFromBackend,
  getSalesFromBackend,
  getLowStockFromBackend,
  getReceivablesFromBackend,
  getExpensesFromBackend,
  getCashFlowHistoricalFromBackend,
} from "../backend-api";

/* =====================================================
   TYPES
===================================================== */

type SalesResult = {
  date: string;
  total_sales: number;
  transactions_count: number;
  currency: string;
};

type WeeklySalesResult = {
  start_date: string;
  end_date: string;
  total_sales: number;
  transactions_count: number;
  currency: string;
};

type ProductResult = {
  product_name: string;
  quantity_sold: number;
  sales_amount: number;
};

type LowStockProduct = {
  product_id?: string;
  product_name: string;
  current_stock: number;
  minimum_stock: number;
};

type Receivable = {
  customer_id?: string;
  customer_name: string;
  amount: number;
  outstanding_amount?: number;
  due_date?: string;
};

type ExpenseResult = {
  month: string;
  total_expenses: number;
  previous_period_expenses: number;
  currency: string;
  categories: {
    category: string;
    amount: number;
  }[];
};

type TopExpenseResult = {
  expense_name: string;
  amount: number;
  currency: string;
};

type BusinessInsightResult = {
  insight: string;
  today_sales: number;
  weekly_sales: number;
  monthly_expenses: number;
  receivables: number;
  low_stock_count: number;
};

type CashFlowData = {
  period_days: number;
  start_date: string;
  end_date: string;
  current_cash_balance: number;
  total_sales: number;
  total_expenses: number;
  expected_receivables_7d: number;
  expected_expenses_7d: number;
  currency: string;
};

type BusinessHealthBreakdown = {
  sales: number;
  inventory: number;
  expenses: number;
  cashFlow: number;
  receivables: number;
};

type BusinessHealthResult = {
  score: number;
  status:
    | "EXCELLENT"
    | "GOOD"
    | "FAIR"
    | "WEAK"
    | "CRITICAL";
  breakdown: BusinessHealthBreakdown;
  strengths: string[];
  risks: string[];
  data: {
    insight: string;
    today_sales: number;
    weekly_sales: number;
    monthly_expenses: number;
    receivables: number;
    low_stock_count: number;
    breakdown: BusinessHealthBreakdown;
    cash_flow: {
      period_days: number;
      start_date: string;
      end_date: string;
      current_cash_balance: number;
      total_sales: number;
      total_expenses: number;
      expected_receivables_7d: number;
      expected_expenses_7d: number;
      currency: string;
    };
  };
};

/* =====================================================
   DATE HELPERS
===================================================== */

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentWeekRange() {
  const today = new Date();

  // Use local calendar date explicitly.
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();

  // JavaScript:
  // Sunday = 0
  // Monday = 1
  // ...
  // Saturday = 6
  const day = today.getDay();

  // Number of days we need to go back to Monday.
  const daysSinceMonday =
    day === 0 ? 6 : day - 1;

  const start = new Date(
    year,
    month,
    date - daysSinceMonday,
  );

  const end = new Date(
    year,
    month,
    date,
  );

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

/* =====================================================
   TODAY SALES
===================================================== */

export async function getTodaySales(
  date: string,
  token?: string,
): Promise<SalesResult> {
  if (!token) {
    throw new Error(
      "Access token is required for getTodaySales",
    );
  }

  const result =
    await getTodaySalesFromBackend(token);

  return result.data;
}

/* =====================================================
   WEEKLY SALES
===================================================== */

export async function getWeeklySales(
  start?: string,
  end?: string,
  token?: string,
): Promise<WeeklySalesResult> {
  if (!token) {
    throw new Error(
      "Access token is required for getWeeklySales",
    );
  }

  const range = getCurrentWeekRange();

  console.log(
    "📅 WEEK RANGE DEBUG:",
    range,
  );

  console.log(
    "📅 START INPUT:",
    start,
  );

  console.log(
    "📅 END INPUT:",
    end,
  );

  const startDate =
    start || range.startDate;

  const endDate =
    end || range.endDate;

  const result =
    await getSalesFromBackend(
      token,
      startDate,
      endDate,
    );

  return {
    start_date:
      result.data.start_date,

    end_date:
      result.data.end_date,

    total_sales:
      result.data.total_sales,

    transactions_count:
      result.data.transactions_count,

    currency:
      result.data.currency,
  };
}

/* =====================================================
   TOP PRODUCT
===================================================== */

export async function getTopProduct(
  token?: string,
): Promise<ProductResult | null> {
  if (!token) {
    throw new Error(
      "Access token is required for getTopProduct",
    );
  }

  const range =
    getCurrentWeekRange();

  const result =
    await getSalesFromBackend(
      token,
      range.startDate,
      range.endDate,
    );

  const products =
    result.data.products ?? [];

  if (products.length === 0) {
    return null;
  }

  return products.reduce(
    (top, current) =>
      current.quantity_sold >
      top.quantity_sold
        ? current
        : top,
  );
}

/* =====================================================
   WEEKLY PRODUCTS
===================================================== */

export async function getWeeklyProducts(
  token?: string,
): Promise<ProductResult[]> {
  if (!token) {
    throw new Error(
      "Access token is required for getWeeklyProducts",
    );
  }

  const range =
    getCurrentWeekRange();

  const result =
    await getSalesFromBackend(
      token,
      range.startDate,
      range.endDate,
    );

  return result.data.products ?? [];
}

/* =====================================================
   DEMAND FORECAST TYPE
===================================================== */

export type DemandForecastResult = {
  product_name: string;

  forecast_days: number;

  predicted_quantity: number;

  average_daily_demand: number;

  historical_quantity: number;

  has_historical_data: boolean;

  source_period: {
    start_date: string;
    end_date: string;
    period_days: number;
  };

  currency: string;
};

/* =====================================================
   LOW STOCK
===================================================== */

export async function getLowStockProducts(
  token?: string,
): Promise<LowStockProduct[]> {
  if (!token) {
    throw new Error(
      "Access token is required for getLowStockProducts",
    );
  }

  const result =
    await getLowStockFromBackend(token);

  return result.data.products ?? [];
}

/* =====================================================
   TOP RECEIVABLE
===================================================== */

export async function getTopReceivable(
  token?: string,
): Promise<{
  customer_name: string;
  amount: number;
  currency: string;
} | null> {
  if (!token) {
    throw new Error(
      "Access token is required for getTopReceivable",
    );
  }

  const result =
    await getReceivablesFromBackend(token);

  const customers =
    result.data.customers ?? [];

  if (customers.length === 0) {
    return null;
  }

  const top = customers.reduce(
    (max, current) => {
      const currentAmount =
        Number(
          current.amount ??
            current.outstanding_amount ??
            0,
        );

      const maxAmount =
        Number(
          max.amount ??
            max.outstanding_amount ??
            0,
        );

      return currentAmount > maxAmount
        ? current
        : max;
    },
  );

  return {
    customer_name:
      top.customer_name,

    amount:
      Number(
        top.amount ??
          top.outstanding_amount ??
          0,
      ),

    currency: "EGP",
  };
}

/* =====================================================
   RECEIVABLES
===================================================== */

export async function getReceivables(
  token?: string,
): Promise<Receivable[]> {
  if (!token) {
    throw new Error(
      "Access token is required for getReceivables",
    );
  }

  const result =
    await getReceivablesFromBackend(token);

  return result.data.customers ?? [];
}

/* =====================================================
   MONTHLY EXPENSES
===================================================== */

export async function getMonthlyExpenses(
  period?: string,
  token?: string,
): Promise<ExpenseResult> {
  if (!token) {
    throw new Error(
      "Access token is required for getMonthlyExpenses",
    );
  }

  const month =
    period &&
    /^\d{4}-\d{2}$/.test(period)
      ? period
      : new Date()
          .toISOString()
          .slice(0, 7);

  const result =
    await getExpensesFromBackend(
      token,
      month,
    );

  return result.data;
}

/* =====================================================
   TOP EXPENSE
===================================================== */

export async function getTopExpense(
  token?: string,
): Promise<TopExpenseResult | null> {
  if (!token) {
    throw new Error(
      "Access token is required for getTopExpense",
    );
  }

  const currentMonth =
    new Date()
      .toISOString()
      .slice(0, 7);

  const result =
    await getExpensesFromBackend(
      token,
      currentMonth,
    );

  const categories =
    result.data.categories ?? [];

  if (categories.length === 0) {
    return null;
  }

  const top = categories.reduce(
    (max, current) =>
      Number(current.amount) >
      Number(max.amount)
        ? current
        : max,
  );

  return {
    expense_name:
      top.category,

    amount:
      Number(top.amount),

    currency:
      result.data.currency,
  };
}

/* =====================================================
   BUSINESS INSIGHT
===================================================== */

export async function getBusinessInsight(
  token?: string,
): Promise<BusinessInsightResult> {
  if (!token) {
    throw new Error(
      "Access token is required for getBusinessInsight",
    );
  }

  const range =
    getCurrentWeekRange();

  const [
    todaySalesResponse,
    weeklySalesResponse,
    lowStockResponse,
    receivablesResponse,
    expensesResponse,
  ] = await Promise.all([
    getTodaySalesFromBackend(token),

    getSalesFromBackend(
      token,
      range.startDate,
      range.endDate,
    ),

    getLowStockFromBackend(token),

    getReceivablesFromBackend(token),

    getExpensesFromBackend(token),
  ]);

  const todaySales =
    Number(
      todaySalesResponse.data
        .total_sales ?? 0,
    );

  const weeklySales =
    Number(
      weeklySalesResponse.data
        .total_sales ?? 0,
    );

  const monthlyExpenses =
    Number(
      expensesResponse.data
        .total_expenses ?? 0,
    );

  const receivables = (
    receivablesResponse.data
      .customers ?? []
  ).reduce(
    (sum, customer) =>
      sum +
      Number(
        customer.amount ??
          customer.outstanding_amount ??
          0,
      ),
    0,
  );

  const lowStockCount = (
    lowStockResponse.data
      .products ?? []
  ).length;

  let insight =
    "وضع البيزنس مستقر حاليًا.";

  if (lowStockCount > 0) {
    insight =
      `عندك ${lowStockCount} منتج محتاج تراجع مخزونه.`;
  } else if (receivables > 0) {
    insight =
      `عندك حوالي ${receivables} جنيه مستحقين عند العملاء.`;
  } else if (
    monthlyExpenses > weeklySales
  ) {
    insight =
      "المصاريف محتاجة متابعة مقارنة بالمبيعات.";
  } else if (
    todaySales === 0 &&
    weeklySales === 0 &&
    monthlyExpenses === 0 &&
    receivables === 0
  ) {
    insight =
      "مفيش نشاط تجاري مسجل في البيانات الحالية.";
  }

  return {
    insight,

    today_sales:
      todaySales,

    weekly_sales:
      weeklySales,

    monthly_expenses:
      monthlyExpenses,

    receivables,

    low_stock_count:
      lowStockCount,
  };
}

/* =====================================================
   CASH FLOW FORECAST
   REAL BACKEND DATA
===================================================== */

export type CashFlowForecastResult = {
  forecast_days: number;

  current_cash_balance: number;

  predicted_inflow: number;

  predicted_outflow: number;

  predicted_net_cash_flow: number;

  predicted_cash_balance: number;

  breakdown: {
    predicted_sales: number;

    expected_receivables: number;

    expected_expenses: number;
  };

  source_period: {
    start_date: string;

    end_date: string;

    period_days: number;
  };

  currency: string;
};

export async function getCashFlowForecast(
  period: string | null,
  token?: string,
): Promise<CashFlowForecastResult> {
  if (!token) {
    throw new Error(
      "Access token is required for getCashFlowForecast",
    );
  }

  /*
   * For the first version of Feqqa forecasting,
   * we forecast the next 7 days using the latest
   * 30 days of real business data.
   */

  const forecastDays = 7;

  const result =
    await getCashFlowHistoricalFromBackend(
      token,
      30,
    );

  const data = result.data;

  /* =====================================================
     REAL HISTORICAL DATA
  ===================================================== */

  const totalSales =
    Number(data.total_sales ?? 0);

  const totalExpenses =
    Number(data.total_expenses ?? 0);

  const currentCashBalance =
    Number(
      data.current_cash_balance ?? 0,
    );

  const expectedReceivables =
    Number(
      data.expected_receivables_7d ?? 0,
    );

  const expectedExpenses =
    Number(
      data.expected_expenses_7d ?? 0,
    );

  /* =====================================================
     SALES FORECAST
  ===================================================== */

  const historicalDays =
    Number(data.period_days ?? 30) || 30;

  const averageDailySales =
    totalSales / historicalDays;

  const predictedSales =
    averageDailySales * forecastDays;

  /* =====================================================
     INFLOW FORECAST
  ===================================================== */

  const predictedInflow =
    predictedSales +
    expectedReceivables;

  /* =====================================================
     OUTFLOW FORECAST
  ===================================================== */

  /*
   * The backend already calculates the expected
   * expenses for the next 7 days.
   */

  const predictedOutflow =
    expectedExpenses;

  /* =====================================================
     NET CASH FLOW
  ===================================================== */

  const predictedNetCashFlow =
    predictedInflow -
    predictedOutflow;

  /* =====================================================
     EXPECTED CASH BALANCE
  ===================================================== */

  const predictedCashBalance =
    currentCashBalance +
    predictedNetCashFlow;

  return {
    forecast_days:
      forecastDays,

    current_cash_balance:
      currentCashBalance,

    predicted_inflow:
      predictedInflow,

    predicted_outflow:
      predictedOutflow,

    predicted_net_cash_flow:
      predictedNetCashFlow,

    predicted_cash_balance:
      predictedCashBalance,

    breakdown: {
      predicted_sales:
        predictedSales,

      expected_receivables:
        expectedReceivables,

      expected_expenses:
        predictedOutflow,
    },

    source_period: {
      start_date:
        data.start_date,

      end_date:
        data.end_date,

      period_days:
        historicalDays,
    },

    currency:
      data.currency ?? "EGP",
  };
}

/* =====================================================
   DEMAND FORECAST
   REAL BACKEND DATA
===================================================== */

export async function getDemandForecast(
  product: string,
  period: string | null,
  token?: string,
): Promise<DemandForecastResult> {
  if (!token) {
    throw new Error(
      "Access token is required for getDemandForecast",
    );
  }

  if (
    !product ||
    product.trim() === ""
  ) {
    throw new Error(
      "Product name is required for demand forecast",
    );
  }

  /*
   * First version:
   * Use the latest 30 days of real sales data
   * to forecast the next 7 days.
   */

  const forecastDays = 7;

  const historicalDays = 30;

  const today = new Date();

  const endDate =
    formatDate(today);

  const start =
    new Date(today);

  start.setDate(
    start.getDate() -
      (historicalDays - 1),
  );

  const startDate =
    formatDate(start);

  const result =
    await getSalesFromBackend(
      token,
      startDate,
      endDate,
    );

  const products =
    result.data.products ?? [];

  /* =====================================================
     NORMALIZE PRODUCT NAME
  ===================================================== */

  const requestedProduct =
    product
      .trim()
      .toLowerCase();

  /* =====================================================
     EXACT MATCH
  ===================================================== */

  let matchedProduct =
    products.find(
      (item) =>
        item.product_name
          .trim()
          .toLowerCase() ===
        requestedProduct,
    );

  /* =====================================================
     PARTIAL MATCH
  ===================================================== */

  if (!matchedProduct) {
    matchedProduct =
      products.find((item) => {
        const productName =
          item.product_name
            .trim()
            .toLowerCase();

        return (
          productName.includes(
            requestedProduct,
          ) ||
          requestedProduct.includes(
            productName,
          )
        );
      });
  }

  /* =====================================================
     NO HISTORICAL DATA
  ===================================================== */

  if (!matchedProduct) {
    return {
      product_name:
        product,

      forecast_days:
        forecastDays,

      predicted_quantity:
        0,

      average_daily_demand:
        0,

      historical_quantity:
        0,

      has_historical_data:
        false,

      source_period: {
        start_date:
          result.data.start_date ??
          startDate,

        end_date:
          result.data.end_date ??
          endDate,

        period_days:
          historicalDays,
      },

      currency:
        result.data.currency ??
        "EGP",
    };
  }

  /* =====================================================
     HISTORICAL QUANTITY
  ===================================================== */

  const historicalQuantity =
    Number(
      matchedProduct.quantity_sold ??
        0,
    );

  /* =====================================================
     AVERAGE DAILY DEMAND
  ===================================================== */

  const averageDailyDemand =
    historicalQuantity /
    historicalDays;

  /* =====================================================
     FORECAST NEXT 7 DAYS
  ===================================================== */

  const predictedQuantity =
    averageDailyDemand *
    forecastDays;

  /* =====================================================
     FINAL RESULT
  ===================================================== */

  return {
    product_name:
      matchedProduct.product_name,

    forecast_days:
      forecastDays,

    predicted_quantity:
      Math.round(
        predictedQuantity,
      ),

    average_daily_demand:
      Number(
        averageDailyDemand.toFixed(2),
      ),

    historical_quantity:
      historicalQuantity,

    has_historical_data:
      true,

    source_period: {
      start_date:
        result.data.start_date ??
        startDate,

      end_date:
        result.data.end_date ??
        endDate,

      period_days:
        historicalDays,
    },

    currency:
      result.data.currency ??
      "EGP",
  };
}

/* =====================================================
   BUSINESS HEALTH SCORE
   REAL BACKEND DATA
===================================================== */

export async function getBusinessHealthScore(
  token?: string,
): Promise<BusinessHealthResult> {
  if (!token) {
    throw new Error(
      "Access token is required for getBusinessHealthScore",
    );
  }

  const [
    insight,
    cashFlowResponse,
  ] = await Promise.all([
    getBusinessInsight(token),

    getCashFlowHistoricalFromBackend(
      token,
      30,
    ),
  ]);

  const cashFlow =
    cashFlowResponse.data;

  const breakdown: BusinessHealthBreakdown = {
    sales: 0,
    inventory: 0,
    expenses: 0,
    cashFlow: 0,
    receivables: 0,
  };

  /* =====================================================
     SALES
  ===================================================== */

  if (
    Number(
      insight.weekly_sales ?? 0,
    ) > 0
  ) {
    breakdown.sales = 20;
  }

  /* =====================================================
     INVENTORY
  ===================================================== */

  if (
    Number(
      insight.low_stock_count ?? 0,
    ) === 0
  ) {
    breakdown.inventory = 20;
  }

  /* =====================================================
     EXPENSES
  ===================================================== */

  if (
    Number(
      insight.monthly_expenses ?? 0,
    ) >= 0
  ) {
    breakdown.expenses = 20;
  }

  /* =====================================================
     CASH FLOW
  ===================================================== */

  const currentCashBalance =
    Number(
      cashFlow.current_cash_balance ??
        0,
    );

  const totalSales =
    Number(
      cashFlow.total_sales ?? 0,
    );

  const totalExpenses =
    Number(
      cashFlow.total_expenses ?? 0,
    );

  const expectedReceivables =
    Number(
      cashFlow.expected_receivables_7d ??
        0,
    );

  const expectedExpenses =
    Number(
      cashFlow.expected_expenses_7d ??
        0,
    );

  if (
    currentCashBalance +
      totalSales +
      expectedReceivables >=
    totalExpenses +
      expectedExpenses
  ) {
    breakdown.cashFlow = 10;
  }

  /* =====================================================
     RECEIVABLES
  ===================================================== */

  if (
    Number(
      insight.receivables ?? 0,
    ) === 0
  ) {
    breakdown.receivables = 20;
  }

  /* =====================================================
     DETECT EMPTY BUSINESS DATA
  ===================================================== */

  const hasBusinessActivity =
    Number(
      insight.today_sales ?? 0,
    ) > 0 ||

    Number(
      insight.weekly_sales ?? 0,
    ) > 0 ||

    Number(
      insight.monthly_expenses ?? 0,
    ) > 0 ||

    Number(
      insight.receivables ?? 0,
    ) > 0 ||

    Number(
      insight.low_stock_count ?? 0,
    ) > 0 ||

    totalSales > 0 ||

    totalExpenses > 0 ||

    currentCashBalance > 0 ||

    expectedReceivables > 0 ||

    expectedExpenses > 0;

  if (!hasBusinessActivity) {
    return {
      score: 0,

      status: "WEAK",

      breakdown: {
        sales: 0,
        inventory: 0,
        expenses: 0,
        cashFlow: 0,
        receivables: 0,
      },

      strengths: [],

      risks: [
        "مفيش نشاط تجاري مسجل في البيانات الحالية.",
      ],

      data: {
        insight:
          "مفيش نشاط تجاري مسجل في البيانات الحالية.",

        today_sales: 0,

        weekly_sales: 0,

        monthly_expenses: 0,

        receivables: 0,

        low_stock_count: 0,

        breakdown: {
          sales: 0,
          inventory: 0,
          expenses: 0,
          cashFlow: 0,
          receivables: 0,
        },

        cash_flow:
          cashFlow,
      },
    };
  }

  /* =====================================================
     SCORE
  ===================================================== */

  const score =
    breakdown.sales +
    breakdown.inventory +
    breakdown.expenses +
    breakdown.cashFlow +
    breakdown.receivables;

  /* =====================================================
     STATUS
  ===================================================== */

  let status:
    | "EXCELLENT"
    | "GOOD"
    | "FAIR"
    | "WEAK"
    | "CRITICAL";

  if (score >= 90) {
    status = "EXCELLENT";
  } else if (score >= 75) {
    status = "GOOD";
  } else if (score >= 50) {
    status = "FAIR";
  } else if (score >= 25) {
    status = "WEAK";
  } else {
    status = "CRITICAL";
  }

  /* =====================================================
     STRENGTHS & RISKS
  ===================================================== */

  const strengths: string[] = [];

  const risks: string[] = [];

  if (breakdown.sales >= 20) {
    strengths.push(
      "المبيعات موجودة خلال الأسبوع الحالي.",
    );
  } else {
    risks.push(
      "مفيش مبيعات مسجلة خلال الأسبوع الحالي.",
    );
  }

  if (breakdown.inventory >= 20) {
    strengths.push(
      "مفيش منتجات مسجلة كـ Low Stock حاليًا.",
    );
  } else {
    risks.push(
      "فيه منتجات محتاجة إعادة تخزين.",
    );
  }

  if (breakdown.expenses >= 20) {
    strengths.push(
      "مفيش مصروفات مسجلة خلال فترة البيانات الحالية.",
    );
  }

  if (breakdown.cashFlow >= 10) {
    strengths.push(
      "التدفق النقدي الحالي في وضع مستقر.",
    );
  } else {
    risks.push(
      "التدفق النقدي محتاج متابعة.",
    );
  }

  if (breakdown.receivables >= 20) {
    strengths.push(
      "مفيش مبالغ مستحقة على العملاء حاليًا.",
    );
  } else {
    risks.push(
      "فيه مبالغ مستحقة على العملاء محتاجة متابعة.",
    );
  }

  /* =====================================================
     FINAL RESULT
  ===================================================== */

  return {
    score,

    status,

    breakdown,

    strengths,

    risks,

    data: {
      insight:
        insight.insight,

      today_sales:
        Number(
          insight.today_sales ?? 0,
        ),

      weekly_sales:
        Number(
          insight.weekly_sales ?? 0,
        ),

      monthly_expenses:
        Number(
          insight.monthly_expenses ?? 0,
        ),

      receivables:
        Number(
          insight.receivables ?? 0,
        ),

      low_stock_count:
        Number(
          insight.low_stock_count ?? 0,
        ),

      breakdown,

      cash_flow:
        cashFlow,
    },
  };
}