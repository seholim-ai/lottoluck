import { NextResponse } from 'next/server';
import { getRandomNumbers, getHotNumbers, getInteractiveRecommendation, MOCK_DRAWS } from '@/lib/lotto-utils';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type } = body;

        let numbers: number[] = [];

        switch (type) {
            case 'interactive':
                numbers = getInteractiveRecommendation(MOCK_DRAWS);
                break;
            case 'hot':
                numbers = getHotNumbers(MOCK_DRAWS);
                break;
            case 'random':
            default:
                numbers = getRandomNumbers();
                break;
        }

        return NextResponse.json({ numbers });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate numbers' }, { status: 500 });
    }
}
