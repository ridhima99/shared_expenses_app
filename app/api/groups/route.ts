// app/api/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { groupService } from '@/services/group/groupService';
import { createGroupSchema } from '@/validations/group/schema';
import { auth } from '@/auth'; // Using your v5 auth

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const groups = await groupService.getGroups(session.user.id);
    return NextResponse.json(groups);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createGroupSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors }, { status: 400 });
    }

    const group = await groupService.createGroup(validated.data);
    return NextResponse.json(group, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}