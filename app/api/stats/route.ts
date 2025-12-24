import { NextResponse } from 'next/server';
import { MOCK_DRAWS, getHotColdStats } from '@/lib/lotto-utils';

export async function GET() {
    try {
        const stats = getHotColdStats(MOCK_DRAWS);
        return NextResponse.json({
            draws: MOCK_DRAWS.slice(0, 10), // Return last 10 draws
            frequency: stats.all,
            hot: stats.hot,
            cold: stats.cold
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}
