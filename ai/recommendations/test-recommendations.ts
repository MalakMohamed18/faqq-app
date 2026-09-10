import { generateRecommendations } from "./recommendation-engine";

const data = {
  lowStockProducts: [
    {
      product_name: "سكر",
      current_stock: 5,
      minimum_stock: 10,
    },
    {
      product_name: "أرز",
      current_stock: 0,
      minimum_stock: 10,
    },
  ],

  expenses: {
    current: 15000,
    previous: 10000,
  },

  cashFlow: {
    predicted_net_cash_flow: -3000,
  },

  sales: {
    current: 15000,
    previous: 10000,
  },
};

const recommendations =
  generateRecommendations(data);

console.log("\n Recommendations:\n");

console.dir(recommendations, {
  depth: null,
});