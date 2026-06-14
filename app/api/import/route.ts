import { NextRequest, NextResponse } from 'next/server';
import { importService } from '@/services/import/importService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { groupId, csvContent } = body;
    
    if (!groupId || !csvContent) {
      return NextResponse.json({ error: 'groupId and csvContent required' }, { status: 400 });
    }
    
    const result = await importService.importCSV(groupId, csvContent);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}