import { z } from "zod";

export const InvoiceItemSchema = z.object({
  product: z.string().min(1),

  quantity: z.number().positive(),

  unit_price: z.number().nonnegative(),

  total: z.number().nonnegative(),
});

export const InvoiceSchema = z.object({
  invoice_number: z.string().nullable(),

  supplier: z.string().nullable(),

  date: z.string().nullable(),

  items: z.array(InvoiceItemSchema).min(1),

  subtotal: z.number().nonnegative().nullable(),

  tax: z.number().nonnegative().nullable(),

  discount: z.number().nonnegative().nullable(),

  amount_due: z.number().nonnegative().nullable(),

  total: z.number().nonnegative(),

  currency: z.string().nullable(),
});

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type InvoiceData = z.infer<typeof InvoiceSchema>;