import { prisma } from '@/lib/prisma/client';
import type { CreateSettlementInput } from '@/validations/settlement/schema';
import { getSession } from '@/lib/auth/session';
import { Decimal } from 'decimal.js';
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
    
    // Sort and cast to Decimal for safe math
    const creditors = balances
      .filter((b: any) => new Decimal(b.net).gt(0))
      .sort((a: any, b: any) => new Decimal(b.net).comparedTo(new Decimal(a.net)));
      
    const debtors = balances
      .filter((b: any) => new Decimal(b.net).lt(0))
      .sort((a: any, b: any) => new Decimal(a.net).comparedTo(new Decimal(b.net)));
    
    const optimizedSettlements: any[] = [];
    
    let creditorIdx = 0;
    let debtorIdx = 0;
    
    while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
      const creditor = { ...creditors[creditorIdx], net: new Decimal(creditors[creditorIdx].net) };
      const debtor = { ...debtors[debtorIdx], net: new Decimal(debtors[debtorIdx].net) };
      
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
      
      // Update local net values and store back as numbers
      creditors[creditorIdx].net = creditor.net.minus(amount).toNumber();
      debtors[debtorIdx].net = debtor.net.plus(amount).toNumber();
      
      if (new Decimal(creditors[creditorIdx].net).eq(0)) creditorIdx++;
      if (new Decimal(debtors[debtorIdx].net).eq(0)) debtorIdx++;
    }
    
    return optimizedSettlements;
  }
}

export const settlementService = new SettlementService();