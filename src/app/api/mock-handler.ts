import { NextResponse } from 'next/server';

/**
 * MOCK API ROUTES FOR VERCEL
 * These routes are kept to prevent '404' or build errors, 
 * but the actual logic is moved to the client-side localDb.
 */

export async function GET() {
  return NextResponse.json({ success: true, message: "System operational" });
}

export async function POST() {
  return NextResponse.json({ success: true });
}

export async function PUT() {
  return NextResponse.json({ success: true });
}
