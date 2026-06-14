// import { prisma } from '@/lib/prisma/client';
// import { CreateExpenseInput, UpdateExpenseInput } from '@/validations/expense/schema';
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
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GroupList from "@/components/GroupList";

type Group = {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  _count: {
    expenses: number;
    members: number;
  };
};

export default function DashboardPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      if (!session.user) return;
      
      const res = await fetch(`/api/groups?userId=${session.user.id}`);
      const data = await res.json();
      setGroups(data);
      setIsLoading(false);
    };
    
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link
            href="/dashboard/groups"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Create Group
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You don't have any groups yet.</p>
            <Link
              href="/dashboard/groups"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Create Your First Group
            </Link>
          </div>
        ) : (
          <GroupList groups={groups} />
        )}
      </div>
    </div>
  );
}