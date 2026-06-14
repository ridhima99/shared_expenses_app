import { z } from 'zod';

export const splitTypes = ['EQUAL', 'PERCENTAGE', 'SHARE', 'EXACT'];

export const createExpenseSchema = z.object({
  groupId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  amount: z.number().positive(),
  currency: z.enum(['INR', 'USD']).default('INR'),
  date: z.string(),
  paidBy: z.string(),
  splitType: z.enum(splitTypes as any),
  participants: z.array(
    z.object({
      userId: z.string(),
      amount: z.number().positive().optional(),
      percentage: z.number().min(0).max(100).optional(),
      shares: z.number().min(0).optional(),
    })
  ).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;