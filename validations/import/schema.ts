import { z } from 'zod';

export const anomalyTypes = [
  'DUPLICATE',
  'NEAR_DUPLICATE',
  'MISSING_PAYER',
  'MISSING_CURRENCY',
  'INVALID_AMOUNT',
  'NEGATIVE_AMOUNT',
  'ZERO_AMOUNT',
  'INVALID_DATE',
  'AMBIGUOUS_DATE',
  'USER_NAME_VARIATION',
  'SETTLEMENT_AS_EXPENSE',
  'SPLIT_MISMATCH',
  'PERCENTAGE_NOT_100',
  'INVALID_SHARES',
  'MEMBERSHIP_VIOLATION',
  'EXTERNAL_PARTICIPANT',
  'CURRENCY_MISMATCH',
  'EXCESS_DECIMAL_PRECISION',
];

export const severityLevels = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];

export const anomalyReportSchema = z.object({
  importRowId: z.string(),
  type: z.enum(anomalyTypes as any),
  message: z.string(),
  severity: z.enum(severityLevels as any).default('WARNING'),
  oldValue: z.string().optional(),
  newValue: z.string().optional(),
});

export const resolveAnomalySchema = z.object({
  anomalyId: z.string(),
  isResolved: z.boolean(),
  resolvedBy: z.string().optional(),
});

export type AnomalyReportInput = z.infer<typeof anomalyReportSchema>;
export type ResolveAnomalyInput = z.infer<typeof resolveAnomalySchema>;