import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { type, id } = await request.json(); // type: 'group' | 'expense' | 'member'

    if (type === 'group') await prisma.group.delete({ where: { id } });
    if (type === 'expense') await prisma.expense.delete({ where: { id } });
    if (type === 'member') await prisma.groupMember.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}