import { NextResponse } from 'next/server';

export async function GET() {
  console.log("Service maintenu actif par ping externe");
  return NextResponse.json({ success: true });
}