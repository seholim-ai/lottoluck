'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface StatsChartProps {
    data: Record<number, number>;
}

export default function StatsChart({ data }: StatsChartProps) {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: '출현 빈도',
                data: Object.values(data),
                backgroundColor: 'rgba(139, 92, 246, 0.5)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#f8fafc',
                borderColor: '#334155',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 10,
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-full min-h-[300px]">
            <Bar data={chartData} options={options} />
        </div>
    );
}
