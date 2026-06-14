import { prisma } from '@/lib/prisma/client';
import type { CreateSettlementInput } from '@/validations/settlement/schema';
import { getSession } from '@/lib/auth/session';
import { Decimal } from '@prisma/client/runtime/library';
import { balanceService } from '@/services/balance/balanceService';

export class SettlementService {
  async createSettlement(input: CreateSettlementInput) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    
    const settlement = await prisma.settlement.create({
      data: {
        groupId: input.groupId,
        payerId: input.payerId,
        receiverId: input.receiverId,
        amount: input.amount,
        currency: input.currency,
        date: input.date ? new Date(input.date) : new Date(),
      },
      include: {
        payer: true,
        receiver: true,
      },
    });
    
    return settlement;
  }
  
  async getSettlements(groupId: string, userId: string) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    
    const isMember = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: session.user.id,
        leaveDate: null,
      },
    });
    
    if (!isMember) {
      throw new Error('Not a member of this group');
    }
    
    return prisma.settlement.findMany({
      where: { groupId },
      include: {
        payer: true,
        receiver: true,
      },
      orderBy: { date: 'desc' },
    });
  }
  
  async optimizeSettlements(groupId: string, dateFrom?: Date, dateTo?: Date) {
    const balances = await balanceService.calculateGroupBalances(groupId, dateFrom, dateTo);
    
    const creditors = balances.filter((b: any) => b.net.gt(0)).sort((a: any, b: any) => b.net.gt(a.net) ? 1 : -1);
    const debtors = balances.filter((b: any) => b.net.lt(0)).sort((a: any, b: any) => a.net.lt(b.net) ? 1 : -1);
    
    const optimizedSettlements: any[] = [];
    
    let creditorIdx = 0;
    let debtorIdx = 0;
    
    while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
      const creditor = creditors[creditorIdx];
      const debtor = debtors[debtorIdx];
      
      const debtorAmount = debtor.net.times(-1);
      const amount = debtorAmount.lt(creditor.net) ? debtorAmount : creditor.net;
      
      if (amount.gt(0)) {
        optimizedSettlements.push({
          payerId: debtor.userId,
          receiverId: creditor.userId,
          amount: amount.toNumber(),
          currency: 'INR',
        });
      }
      
      creditor.net = creditor.net.minus(amount);
      debtor.net = debtor.net.plus(amount);
      
      if (creditor.net.eq(0)) creditorIdx++;
      if (debtor.net.eq(0)) debtorIdx++;
    }
    
    return optimizedSettlements;
  }
}

export const settlementService = new SettlementService();