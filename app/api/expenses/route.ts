import { NextRequest, NextResponse } from 'next/server';
import { expenseService } from '@/services/expense/expenseService';
import { createExpenseSchema } from '@/validations/expense/schema';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    
    if (!groupId) return NextResponse.json({ error: 'groupId required' }, { status: 400 });

    const expenses = await expenseService.getExpenses(groupId, session.user.id);
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const validated = createExpenseSchema.safeParse(body);
    
    if (!validated.success) {
      console.error("❌ VALIDATION FAILED FOR PAYLOAD:", body);
      console.error("❌ REASON:", JSON.stringify(validated.error.errors, null, 2));
      return NextResponse.json({ error: validated.error.errors }, { status: 400 });
    }

    const expense = await expenseService.createExpense(validated.data);
    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.error("🔥 EXPENSE CREATION ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}