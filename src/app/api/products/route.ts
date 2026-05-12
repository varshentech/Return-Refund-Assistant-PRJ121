import { db } from '@/db';
import { products } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  const allProducts = await db.select().from(products);
  return NextResponse.json(allProducts);
}
