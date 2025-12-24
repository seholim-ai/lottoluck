export interface LottoDraw {
    id: number;
    draw_number: number;
    numbers: number[];
    bonus: number;
    draw_date: string;
}

export const MOCK_DRAWS: LottoDraw[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    draw_number: 1100 + i,
    numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1).sort((a, b) => a - b),
    bonus: Math.floor(Math.random() * 45) + 1,
    draw_date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
}));

export function getRandomNumbers(): number[] {
    const numbers: Set<number> = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

export function getHotColdStats(draws: LottoDraw[]) {
    const frequency: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) frequency[i] = 0;

    draws.forEach((draw) => {
        draw.numbers.forEach((num) => {
            frequency[num]++;
        });
    });

    const sorted = Object.entries(frequency)
        .map(([num, count]) => ({ number: parseInt(num), count }))
        .sort((a, b) => b.count - a.count);

    return {
        hot: sorted.slice(0, 10).map((item) => item.number),
        cold: sorted.slice(-10).map((item) => item.number),
        all: frequency,
    };
}

export function getHotNumbers(draws: LottoDraw[], count: number = 6): number[] {
    const { hot } = getHotColdStats(draws);
    const shuffled = [...hot].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).sort((a, b) => a - b);
}

export function getInteractiveRecommendation(draws: LottoDraw[]): number[] {
    // 1. Pick a random real draw
    const randomDraw = draws[Math.floor(Math.random() * draws.length)];
    // 2. Select 3 numbers from that real draw
    const realNumbers = [...randomDraw.numbers].sort(() => 0.5 - Math.random()).slice(0, 3).sort((a, b) => a - b);

    // 3. Select 3 additional random numbers, ensuring no duplicates
    const randomNumbers: number[] = [];
    const used = new Set(realNumbers);

    while (randomNumbers.length < 3) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!used.has(num)) {
            used.add(num);
            randomNumbers.push(num);
        }
    }
    randomNumbers.sort((a, b) => a - b);

    // Return combined array (Real First, then Random) - NOT globally sorted
    return [...realNumbers, ...randomNumbers];
}
