import { NextResponse } from 'next/server';
import { getDomainStats } from '@/lib/domain-stats';

export async function GET() {
  try {
    const stats = await getDomainStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domain stats' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
