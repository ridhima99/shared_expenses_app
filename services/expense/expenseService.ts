// import { prisma } from '@/lib/prisma/client';
// import type { CreateExpenseInput } from '@/validations/expense/schema';
// import { getSession } from '@/lib/auth/session';
// import { Decimal } from '@prisma/client/runtime/library';

// export class ExpenseService {
//   async createExpense(input: CreateExpenseInput) {
//     const session = await getSession();
//     if (!session) throw new Error('Unauthorized');
    
//     const splitType = input.splitType;
//     const participants = input.participants || [];
    
//     let expenseParticipants: any[] = [];
    
//     if (splitType === 'EQUAL') {
//       const activeMembers = await this.getActiveMembers(input.groupId, new Date(input.date));
//       if (activeMembers.length === 0) {
//         throw new Error('No active members in group');
//       }
      
//       const amountPerPerson = new Decimal(input.amount).div(activeMembers.length);
      
//       expenseParticipants = activeMembers.map((member: any) => ({
//         userId: member.userId,
//         amount: amountPerPerson,
//       }));
//     } else if (splitType === 'PERCENTAGE') {
//       const totalPercentage = participants.reduce((sum, p) => sum + (p.percentage || 0), 0);
//       if (totalPercentage !== 100) {
//         throw new Error('Percentages must total 100');
//       }
      
//       expenseParticipants = participants.map(p => ({
//         userId: p.userId,
//         amount: new Decimal(input.amount).mul(p.percentage || 0).div(100),
//         percentage: p.percentage,
//       }));
//     } else if (splitType === 'SHARE') {
//       const totalShares = participants.reduce((sum, p) => sum + (p.shares || 0), 0);
//       if (totalShares === 0) {
//         throw new Error('Total shares cannot be zero');
//       }
      
//       expenseParticipants = participants.map(p => ({
//         userId: p.userId,
//         amount: new Decimal(input.amount).mul(p.shares || 0).div(totalShares),
//         shares: p.shares,
//       }));
//     } else if (splitType === 'EXACT') {
//       const totalAmount = participants.reduce((sum, p) => sum + (p.amount || 0), 0);
//       if (totalAmount !== input.amount) {
//         throw new Error('Exact amounts must total expense amount');
//       }
      
//       expenseParticipants = participants.map(p => ({
//         userId: p.userId,
//         amount: p.amount || 0,
//       }));
//     }
    
//     const expense = await prisma.expense.create({
//       data: {
//         groupId: input.groupId,
//         title: input.title,
//         description: input.description,
//         amount: input.amount,
//         currency: input.currency,
//         amountInBase: input.amount,
//         baseCurrency: input.currency,
//         date: new Date(input.date),
//         paidBy: input.paidBy,
//         splitType: splitType,
//         participants: {
//           create: expenseParticipants,
//         },
//       },
//       include: {
//         payer: true,
//         participants: {
//           include: {
//             user: true,
//           },
//         },
//       },
//     });
    
//     return expense;
//   }
  
//   async getExpenses(groupId: string, userId: string) {
//     const session = await getSession();
//     if (!session) throw new Error('Unauthorized');
    
//     const isMember = await prisma.groupMember.findFirst({
//       where: {
//         groupId,
//         userId: session.user.id,
//         leaveDate: null,
//       },
//     });
    
//     if (!isMember) {
//       throw new Error('Not a member of this group');
//     }
    
//     return prisma.expense.findMany({
//       where: { groupId },
//       include: {
//         payer: true,
//         participants: {
//           include: {
//             user: true,
//           },
//         },
//       },
//       orderBy: { date: 'desc' },
//     });
//   }
  
//   async deleteExpense(expenseId: string, userId: string) {
//     const session = await getSession();
//     if (!session) throw new Error('Unauthorized');
    
//     const expense = await prisma.expense.findUnique({
//       where: { id: expenseId },
//     });
    
//     if (!expense) {
//       throw new Error('Expense not found');
//     }
    
//     if (expense.paidBy !== session.user.id) {
//       throw new Error('Only the payer can delete this expense');
//     }
    
//     await prisma.expense.delete({
//       where: { id: expenseId },
//     });
    
//     return { success: true };
//   }
  
//   async getActiveMembers(groupId: string, date: Date) {
//     return prisma.groupMember.findMany({
//       where: {
//         groupId,
//         joinDate: { lte: date },
//         OR: [
//           { leaveDate: null },
//           { leaveDate: { gte: date } },
//         ],
//       },
//       include: {
//         user: true,
//       },
//     });
//   }
// }

// export const expenseService = new ExpenseService();

import { prisma } from '@/lib/prisma/client';
import type { CreateExpenseInput } from '@/validations/expense/schema';
import { balanceService } from '@/services/balance/balanceService';
import { auth } from '@/auth';

export class ExpenseService {
  async createExpense(input: CreateExpenseInput) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    // Verify user is member of group
    const isMember = await prisma.groupMember.findFirst({
      where: { groupId: input.groupId, userId: session.user.id, leaveDate: null },
    });

    if (!isMember) {
      throw new Error('Not a member of this group');
    }

    // THE FIX: Push the expense date to the end of the day to avoid timestamp cutoff issues!
    const expenseDate = new Date(input.date);
    expenseDate.setUTCHours(23, 59, 59, 999);

    const activeMembers = await balanceService.getActiveMembersForDate(
      input.groupId, 
      expenseDate
    );

    const activeUserIds = activeMembers.map(m => m.userId);

    if (activeUserIds.length === 0) {
      throw new Error('No active members found for this date. Check join dates.');
    }

    // Calculate participant amounts based on split type
    let participantsData: any[] = [];

    if (input.splitType === 'EQUAL') {
      const targetMembers = input.participants?.length || activeUserIds.length;
      const perPerson = input.amount / targetMembers;
      
      participantsData = input.participants?.length 
        ? input.participants.map(p => ({ userId: p.userId, amount: perPerson }))
        : activeUserIds.map(userId => ({ userId, amount: perPerson }));
    } else if (input.splitType === 'PERCENTAGE') {
      const totalPercentage = input.participants?.reduce((sum, p) => sum + (p.percentage || 0), 0);
      if (totalPercentage !== 100) throw new Error(`Percentages must total 100, got ${totalPercentage}`);
      
      participantsData = input.participants!.map(p => ({
        userId: p.userId, amount: ((p.percentage || 0) / 100) * input.amount, percentage: p.percentage,
      }));
    } else if (input.splitType === 'SHARE') {
      const totalShares = input.participants?.reduce((sum, p) => sum + (p.shares || 0), 0);
      participantsData = input.participants!.map(p => ({
        userId: p.userId, amount: ((p.shares || 0) / totalShares!) * input.amount, shares: p.shares,
      }));
    } else if (input.splitType === 'EXACT') {
      const totalAmount = input.participants?.reduce((sum, p) => sum + (p.amount || 0), 0);
      if (Math.abs(totalAmount! - input.amount) > 0.01) throw new Error(`Amounts must total ${input.amount}`);
      
      participantsData = input.participants!.map(p => ({ userId: p.userId, amount: p.amount }));
    }

    // Assuming 1:1 base conversion for now (to avoid missing exchange rates crashing the app)
    const amountInBase = input.amount;

    const expense = await prisma.expense.create({
      data: {
        groupId: input.groupId,
        title: input.title,
        amount: input.amount,
        currency: input.currency,
        amountInBase: amountInBase,
        baseCurrency: input.currency,
        date: expenseDate,
        paidBy: input.paidBy,
        splitType: input.splitType,
        participants: { create: participantsData },
      },
      include: { participants: { include: { user: true } }, payer: true },
    });

    return expense;
  }

  async getExpenses(groupId: string, userId: string) {
    return prisma.expense.findMany({
      where: { groupId },
      include: { participants: { include: { user: true } }, payer: true },
      orderBy: { date: 'desc' },
    });
  }
}

export const expenseService = new ExpenseService();