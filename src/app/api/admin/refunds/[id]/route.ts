import { db } from '@/db';
import { refundRequests, users, orders, activityLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { status, finalAmount, deduction } = await req.json();
  const { id: idStr } = await params;
  const refundId = parseInt(idStr);

  const refund = await db.select().from(refundRequests).where(eq(refundRequests.id, refundId)).then(r => r[0]);
  if (!refund || refund.userId === null || refund.orderId === null) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const userId = refund.userId;
  const orderId = refund.orderId;

  if (status === 'approved') {
    // 1. Update User Wallet
    const user = await db.select().from(users).where(eq(users.id, userId)).then(r => r[0]);
    if (user) {
      await db.update(users)
        .set({ walletBalance: user.walletBalance + finalAmount })
        .where(eq(users.id, userId));
    }

    // 2. Update Order Status to 'refunded'
    await db.update(orders).set({ status: 'refunded' }).where(eq(orders.id, orderId));

    // 3. Update Refund Request
    await db.update(refundRequests)
      .set({ status: 'approved', refundAmount: finalAmount, adminDeduction: deduction })
      .where(eq(refundRequests.id, refundId));

    // 4. Log Activity
    await db.insert(activityLogs).values({
      userId: refund.userId,
      action: 'Refund Approved',
      details: `Refund of $${finalAmount} processed (Deduction: $${deduction})`
    });
  } else {
    await db.update(refundRequests).set({ status: 'rejected' }).where(eq(refundRequests.id, refundId));
  }

  return NextResponse.json({ success: true });
}
