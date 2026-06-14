import { NextRequest, NextResponse } from 'next/server';
import { groupService } from '@/services/group/groupService';
import { createGroupSchema } from '@/validations/group/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
    
    const groups = await groupService.getGroups(userId);
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createGroupSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors }, { status: 400 });
    }
    
    const group = await groupService.createGroup(validated.data);
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}