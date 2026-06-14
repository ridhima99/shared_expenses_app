import { z } from 'zod';

export const createSettlementSchema = z.object({
  groupId: z.string(),
  payerId: z.string(),
  receiverId: z.string(),
  amount: z.number().positive(),
  currency: z.enum(['INR', 'USD']).default('INR'),
  date: z.string().optional(),
});

export type CreateSettlementInput = z.infer<typeof createSettlementSchema>;