import { db } from '@/db';
import { aiKnowledge } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { answer } = await req.json();
  const { id: idStr } = await params;
  const id = parseInt(idStr);

  await db.update(aiKnowledge)
    .set({ answer, isPending: false })
    .where(eq(aiKnowledge.id, id));

  return NextResponse.json({ success: true });
}
