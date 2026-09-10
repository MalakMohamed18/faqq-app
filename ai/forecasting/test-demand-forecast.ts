import { forecastDemand } from "./demand-forecast";

const sales = [
  { date: "2026-08-25", quantity: 10 },
  { date: "2026-08-26", quantity: 12 },
  { date: "2026-08-27", quantity: 8 },
  { date: "2026-08-28", quantity: 15 },
  { date: "2026-08-29", quantity: 11 },
  { date: "2026-08-30", quantity: 14 },
  { date: "2026-08-31", quantity: 13 },
];

const result = forecastDemand(
  "Pepsi Can",
  sales
);

console.log("\n DEMAND FORECAST\n");

console.dir(result, {
  depth: null,
});