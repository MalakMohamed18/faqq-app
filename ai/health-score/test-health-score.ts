import { calculateBusinessHealthScore } from "./business-health-score";

const result = calculateBusinessHealthScore({
  sales: {
    current: 52500,
    previous: 45000,
  },

  lowStockProducts: [
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
  ],

  expenses: {
    current: 18500,
    previous: 14000,
  },

  cashFlow: {
    predicted_net_cash_flow: 15900.01,
  },

  receivables: {
    total: 8000,
  },
});

console.log("\n🏥 BUSINESS HEALTH SCORE\n");
console.dir(result, { depth: null });