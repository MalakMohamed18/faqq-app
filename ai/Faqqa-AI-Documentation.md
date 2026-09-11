# Feqqa AI --- Documentation & Backend Integration Contract

## 1. AI Role

AI is responsible for Intent Classification, Entity Extraction,
Confidence Checking, Tool Routing, Business Insight, OCR, Demand
Forecasting, Cash-flow Forecasting, Alerts & Recommendations, Business
Health Score, and Egyptian-Arabic response generation.

**Architecture rule:** Backend + Database are the source of truth. The
LLM interprets verified data and must not invent financial or inventory
numbers.

## 2. Current Pipeline

``` text
User Question
  ↓
Intent Classifier (Ollama / Qwen3:4B)
  ↓
Intent + Entities + Confidence
  ↓
Confidence Check
  ↓
Tool Router
  ↓
Controlled Tool
  ↓
Verified Business Data
  ↓
AI Analysis
  ↓
Response Generator
  ↓
Egyptian Arabic Response
```

## 3. Supported Intents

-   GET_TODAY_SALES
-   GET_WEEKLY_SALES
-   GET_TOP_PRODUCT
-   GET_WEEKLY_PRODUCTS
-   GET_LOW_STOCK
-   GET_TOP_RECEIVABLE
-   GET_RECEIVABLES
-   GET_MONTHLY_EXPENSES
-   GET_TOP_EXPENSE
-   GET_BUSINESS_INSIGHT
-   GET_DEMAND_FORECAST
-   GET_CASH_FLOW_FORECAST
-   GET_BUSINESS_HEALTH_SCORE

## 4. Intent Contract

``` json
{
  "intent": "GET_BUSINESS_HEALTH_SCORE",
  "entities": {
    "date": null,
    "start_date": null,
    "end_date": null,
    "period": null,
    "product": null,
    "customer": null
  },
  "confidence": 1
}
```

Confidence is normalized to `0..1`; current minimum accepted confidence
is `0.7`.

## 5. Business Insight

Business Insight combines sales, inventory, expenses, cash flow and
receivables when needed. The recommendation engine currently supports: -
LOW_STOCK - HIGH_EXPENSE - NEGATIVE_CASH_FLOW - SALES_OPPORTUNITY

## 6. Demand Forecasting

Implemented as an MVP. It needs reliable historical sales/product data
from the backend.

## 7. Cash-flow Forecasting

Implemented as an MVP. Backend supplies verified financial inputs;
forecast values are predictions, not actual balances.

## 8. Alerts & Recommendations

Implemented and tested. Recommendations explain what happened, why it
matters, and what action the shop owner should consider.

## 9. Business Health Score

Implemented and tested. Current result:

``` json
{
  "score": 79,
  "status": "GOOD",
  "breakdown": {
    "sales": 90,
    "inventory": 80,
    "expenses": 55,
    "cashFlow": 90,
    "receivables": 65
  }
}
```

The score evaluates Sales, Inventory, Expenses, Cash Flow, and
Receivables.

## 10. What the Backend Team Must Provide

### Authentication / Business Identity

Every AI request must be associated with the authenticated
`business_id`. AI must never access another business's data.

### Sales

Provide: - date / period - total sales - transaction count - product
sales - quantity sold - sales amount - product_id / product_name

Example:

``` json
{
  "date": "2026-09-10",
  "total_sales": 8500,
  "transactions_count": 42,
  "currency": "EGP"
}
```

### Inventory

``` json
{
  "product_id": "uuid",
  "product_name": "Pepsi Can",
  "current_stock": 8,
  "minimum_stock": 20
}
```

### Receivables

``` json
{
  "customer_id": "uuid",
  "customer_name": "Ahmed",
  "outstanding_amount": 2500,
  "due_date": "2026-09-15"
}
```

### Expenses

``` json
{
  "current": 18500,
  "previous": 14000,
  "currency": "EGP"
}
```

Preferably also expose expense categories and amounts.

### Cash Flow

Provide enough verified data to calculate/validate expected cash
position, for example:

``` json
{
  "cash_in": 30000,
  "cash_out": 14100,
  "predicted_net_cash_flow": 15900
}
```

## 11. Proposed AI Integration

One possible endpoint:

``` http
POST /api/ai/copilot
```

Request:

``` json
{
  "message": "قولي الـ health score بتاع البيزنس عندي وحالة البيزنس إيه؟"
}
```

These endpoint names are proposed contracts, not claims that they
already exist.

Alternative dedicated endpoints:

``` text
GET /api/ai/sales/today
GET /api/ai/sales/weekly
GET /api/ai/products/top
GET /api/ai/products/weekly
GET /api/ai/products/low-stock
GET /api/ai/receivables
GET /api/ai/expenses/monthly
GET /api/ai/expenses/top
GET /api/ai/business/insight-data
GET /api/ai/business/health-score-data
GET /api/ai/forecast/demand
GET /api/ai/forecast/cash-flow
```

## 12. Health Score Backend Contract

Backend should provide data equivalent to:

``` json
{
  "sales": {
    "current": 52500,
    "previous": 45000
  },
  "lowStockProducts": [
    {
      "product_name": "Pepsi Can",
      "current_stock": 8,
      "minimum_stock": 20
    },
    {
      "product_name": "Chips",
      "current_stock": 5,
      "minimum_stock": 15
    }
  ],
  "expenses": {
    "current": 18500,
    "previous": 14000
  },
  "cashFlow": {
    "predicted_net_cash_flow": 15900.01
  },
  "receivables": {
    "total": 8000
  }
}
```

## 13. Backend Must NOT

-   Treat LLM-generated numbers as financial truth.
-   Give the LLM unrestricted database access.
-   Allow arbitrary database operations from model output.
-   Send unverified financial/inventory data.

Correct flow:

``` text
Database → Backend → Controlled AI Tool/API → AI Analysis → Response
```

## 14. OCR Integration

OCR is already implemented on the AI side. Backend integration will need
to provide the uploaded image/file plus business context and
storage/reference information when applicable. OCR results should be
validated before changing business records.

## 15. Testing Status

Completed: - Intent classification - JSON output handling - Confidence
validation - Tool routing - Business Insight - Recommendations - OCR -
Demand Forecasting MVP - Cash-flow Forecasting MVP - Business Health
Score - Health Score response generation - End-to-end Health Score test

Latest successful test:

``` text
Intent: GET_BUSINESS_HEALTH_SCORE
Tool: getBusinessHealthScore
Score: 79/100
Status: GOOD
Pipeline: SUCCESS
```

## 16. Current Next Step

**Backend/API Integration**

Backend team should: 1. Confirm authentication and `business_id` flow.
2. Confirm real database entities and fields. 3. Expose required AI data
through controlled APIs/services. 4. Agree on JSON response contracts.
5. Provide API base URL and authentication method. 6. Provide sample
real API responses. 7. Replace the current mock AI tools with real API
calls.

## 17. Current AI File Map

Important files already used in the AI module: - `ai/faqqa-ai.ts` ---
main pipeline - `ai/intent_classifier.ts` --- intent classification -
`ai/schemas/intent.schema.ts` --- Zod validation -
`ai/prompts/intent-classifier.prompt.ts` --- classifier prompt -
`ai/ollama.ts` --- Ollama/Qwen connection - `ai/confidence-check.ts` ---
confidence gate - `ai/tool-router.ts` --- intent → tool mapping -
`ai/tools/feqqa-tools.ts` --- current controlled/mock tools -
`ai/tools/tool-executor.ts` --- tool execution -
`ai/response-generator.ts` --- final response generation -
`ai/recommendations/recommendation-engine.ts` --- recommendations -
`ai/recommendations/recommendation.types.ts` --- recommendation types -
`ai/test-feqqa-ai.ts` --- end-to-end testing
