import { z } from "zod";

export const IntentSchema = z.object({
  intent: z
    .enum([
      "GET_TODAY_SALES",
      "GET_WEEKLY_SALES",
      "GET_TOP_PRODUCT",
      "GET_WEEKLY_PRODUCTS",
      "GET_LOW_STOCK",
      "GET_TOP_RECEIVABLE",
      "GET_RECEIVABLES",
      "GET_MONTHLY_EXPENSES",
      "GET_TOP_EXPENSE",
      "GET_BUSINESS_INSIGHT",
    ])
    .nullable(),

  entities: z.object({
    date: z.string().nullable(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    period: z.string().nullable(),
    product: z.string().nullable(),
    customer: z.string().nullable(),
  }),

  confidence: z.number().min(0).max(1),
});

export type IntentResult = z.infer<typeof IntentSchema>;