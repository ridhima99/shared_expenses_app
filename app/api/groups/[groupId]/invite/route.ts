import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { auth } from '@/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resolvedParams = await params;
    const groupId = resolvedParams.groupId;
    const { email, name } = await request.json();

    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    // Find the user, or auto-create them if they don't exist
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          password: 'password123', // Dummy password for auto-created flatmates
        }
      });
    }

    // Check if they are already in the group
    const existingMember = await prisma.groupMember.findFirst({
      where: { groupId, userId: user.id, leaveDate: null }
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User is already in the group' }, { status: 400 });
    }

    // Add them to the group
    await prisma.groupMember.create({
      data: { groupId, userId: user.id, joinDate: new Date() }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("🔥 INVITE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}