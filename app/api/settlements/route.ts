import { NextRequest, NextResponse } from 'next/server';
import { settlementService } from '@/services/settlement/settlementService';
import { createSettlementSchema } from '@/validations/settlement/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const userId = searchParams.get('userId');
    
    if (!groupId || !userId) {
      return NextResponse.json({ error: 'groupId and userId required' }, { status: 400 });
    }
    
    const settlements = await settlementService.getSettlements(groupId, userId);
    return NextResponse.json(settlements);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createSettlementSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors }, { status: 400 });
    }
    
    const settlement = await settlementService.createSettlement(validated.data);
    return NextResponse.json(settlement, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}