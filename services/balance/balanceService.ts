import { prisma } from '@/lib/prisma/client';

export class BalanceService {
  
  // THIS IS THE MISSING FUNCTION CAUSING YOUR ERRORS!
  async getActiveMembersForDate(groupId: string, date: Date) {
    return prisma.groupMember.findMany({
      where: {
        groupId,
        joinDate: { lte: date },
        OR: [
          { leaveDate: null },
          { leaveDate: { gte: date } },
        ],
      },
      include: {
        user: true,
      },
    });
  }

  // The main accounting engine
  async calculateGroupBalances(groupId: string) {
    const toDate = new Date();
    
    // Get all members
    const allMembers = await prisma.groupMember.findMany({
      where: { groupId },
      include: { user: true },
    });

    const memberMap = new Map(allMembers.map(m => [m.userId, m.user]));

    // Get all expenses
    const expenses = await prisma.expense.findMany({
      where: { groupId },
      include: { participants: true, payer: true },
    });

    // Get all settlements
    const settlements = await prisma.settlement.findMany({
      where: { groupId },
    });

    // Initialize balances
    const balances = new Map<string, { paid: number; owed: number; net: number }>();
    for (const member of allMembers) {
      balances.set(member.userId, { paid: 0, owed: 0, net: 0 });
    }

    // Process expenses
    for (const expense of expenses) {
      const expenseDate = new Date(expense.date);
      const activeMembers = await this.getActiveMembersForDate(groupId, expenseDate);
      const activeUserIds = activeMembers.map(m => m.userId);
      
      // Payer paid the full amount
      if (activeUserIds.includes(expense.paidBy)) {
        const payerBalance = balances.get(expense.paidBy)!;
        payerBalance.paid += Number(expense.amountInBase);
        balances.set(expense.paidBy, payerBalance);
      }
      
      // Each participant owes their share
      for (const participant of expense.participants) {
        if (activeUserIds.includes(participant.userId)) {
          const participantBalance = balances.get(participant.userId)!;
          participantBalance.owed += Number(participant.amount);
          balances.set(participant.userId, participantBalance);
        }
      }
    }

    // Process settlements
    for (const settlement of settlements) {
      const payerBalance = balances.get(settlement.payerId);
      const receiverBalance = balances.get(settlement.receiverId);
      
      if (payerBalance && receiverBalance) {
        payerBalance.owed -= Number(settlement.amount);
        receiverBalance.paid -= Number(settlement.amount);
        
        balances.set(settlement.payerId, payerBalance);
        balances.set(settlement.receiverId, receiverBalance);
      }
    }

    // Convert to array and calculate net
    const result = [];
    for (const [userId, bal] of balances) {
      const net = bal.paid - bal.owed;
      const userName = memberMap.get(userId)?.name || memberMap.get(userId)?.email || 'Unknown';
      
      result.push({
        userId,
        userName,
        paid: bal.paid,
        owed: bal.owed,
        net,
      });
    }

    return result.sort((a, b) => b.net - a.net);
  }
}

export const balanceService = new BalanceService();