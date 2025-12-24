'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import StatsChart from '@/components/StatsChart';
import { TrendingUp, Snowflake, Flame } from 'lucide-react';

export default function StatsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-primary font-bold">
            데이터를 불러오는 중...
        </div>
    );

    return (
        <main className="min-h-screen pt-24 pb-12 px-6">
            <Navbar />

            <div className="max-w-6xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl font-black gradient-text">번호 분석 통계</h1>
                    <p className="text-muted-foreground">최근 50회차의 당첨 번호 데이터를 기반으로 분석한 결과입니다.</p>
                </header>

                {/* Top Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass-morphism p-8 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Flame className="text-red-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-bold">Hot 번호 (자주 나옴)</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {stats.hot.map((num: number) => (
                                <div key={num} className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold shadow-lg">
                                    {num}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">최근 회차에서 가장 빈번하게 출현한 상위 10개 번호입니다.</p>
                    </div>

                    <div className="glass-morphism p-8 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Snowflake className="text-blue-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-bold">Cold 번호 (드물게 나옴)</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {stats.cold.map((num: number) => (
                                <div key={num} className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg">
                                    {num}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">최근 회차에서 상대적으로 적게 출현한 번호들입니다.</p>
                    </div>
                </div>

                {/* Frequency Chart */}
                <div className="glass-morphism p-8 md:p-12 rounded-3xl space-y-8">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-primary" size={24} />
                        <h2 className="text-2xl font-bold">번호별 출현 빈도 (1~45)</h2>
                    </div>
                    <div className="h-[400px]">
                        <StatsChart data={stats.frequency} />
                    </div>
                </div>

                {/* Recent Draws Table */}
                <div className="glass-morphism rounded-3xl overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                        <h2 className="text-2xl font-bold">최근 당첨 내역 (시뮬레이션)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-muted-foreground text-sm uppercase">
                                <tr>
                                    <th className="px-8 py-4 font-semibold">회차</th>
                                    <th className="px-8 py-4 font-semibold">당첨 번호</th>
                                    <th className="px-8 py-4 font-semibold">보너스</th>
                                    <th className="px-8 py-4 font-semibold">추첨일</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.draws.map((draw: any) => (
                                    <tr key={draw.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-6 font-bold">{draw.draw_number}회</td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2">
                                                {draw.numbers.map((n: number) => (
                                                    <span key={n} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold border border-white/10">
                                                        {n}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 uppercase">
                                            <span className="w-8 h-8 rounded-full bg-accent/20 text-accent border border-accent/30 flex items-center justify-center text-xs font-bold">
                                                {draw.bonus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-muted-foreground">{draw.draw_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

