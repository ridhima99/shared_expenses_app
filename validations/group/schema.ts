// validations/group/schema.ts
import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  currency: z.enum(['INR', 'USD']).default('INR'),
});

export const inviteMemberSchema = z.object({
  groupId: z.string(),
  userId: z.string(),
  joinDate: z.string().optional(),
});

export const removeMemberSchema = z.object({
  groupId: z.string(),
  userId: z.string(),
  leaveDate: z.string().optional(),
});

// FIXED: Added proper typeof inference
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;