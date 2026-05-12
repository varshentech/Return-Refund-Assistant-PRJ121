import { db } from '@/db';
import { aiKnowledge } from '@/db/schema';
import { eq, like } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = message.toLowerCase();

    // 1. Check for Order Tracking request
    if (query.includes('track') || query.includes('status') || query.includes('where')) {
      return NextResponse.json({ 
        answer: "To track your order, please visit the 'My Orders' tab. You'll find real-time GPS tracking and estimated arrival times for all active shipments." 
      });
    }

    // 2. Check for Refund Policy
    if (query.includes('refund') || query.includes('return') || query.includes('policy')) {
      return NextResponse.json({ 
        answer: "Our return policy allows items to be returned within 30 days of delivery. Refunds are processed to your store wallet after admin approval. Some small deductions may apply for processing." 
      });
    }

    // 3. Search Database for Knowledge
    const matches = await db.select()
      .from(aiKnowledge)
      .where(like(aiKnowledge.question, `%${query}%`));

    const existingAnswer = matches.find(m => m.answer && !m.isPending);

    if (existingAnswer) {
      return NextResponse.json({ answer: existingAnswer.answer });
    }

    // 4. Out-of-bounds: Save for Admin
    await db.insert(aiKnowledge).values({
      question: message,
      isPending: true
    });

    return NextResponse.json({ 
      answer: "That's a great question! I'm not quite sure about that yet, so I've forwarded it to our human support team. I'll have an answer for you soon. Thanks for helping me learn!" 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ answer: "I'm having a bit of trouble connecting to my brain right now. Please try again later!" });
  }
}
