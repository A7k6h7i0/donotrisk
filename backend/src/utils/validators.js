import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const categorySchema = z.object({
  name: z.string().min(2),
  parent_id: z.string().trim().min(1).nullable().optional()
});

const releaseDateSchema = z
  .string()
  .trim()
  .refine(
    (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{2}\/\d{2}\/\d{4}$/.test(value),
    "Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY."
  )
  .transform((value) => {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [dd, mm, yyyy] = value.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }
    return value;
  });

export const productSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(2),
  model_number: z.string().min(1),
  category_id: z.string().trim().min(1),
  description: z.string().min(10),
  release_date: releaseDateSchema,
  servicing_frequency_per_year: z.number().int().min(0).max(12),
  warranty_complexity: z.number().int().min(0).max(10),
  failure_rate: z.number().int().min(0).max(100),
  claim_success_probability: z.number().int().min(0).max(100)
});
