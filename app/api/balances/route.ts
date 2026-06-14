import { NextRequest, NextResponse } from 'next/server';
import { balanceService } from '@/services/balance/balanceService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
    if (!groupId) {
      return NextResponse.json({ error: 'groupId required' }, { status: 400 });
    }
    
    const balances = await balanceService.calculateGroupBalances(
      groupId,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined
    );
    
    return NextResponse.json(balances);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}