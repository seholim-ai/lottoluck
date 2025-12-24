'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LottoSlot from '@/components/LottoSlot';
import { Sparkles, Dices, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [numbers, setNumbers] = useState<number[]>(Array(6).fill(0));
    const [spinningIndices, setSpinningIndices] = useState<number[]>([]);
    const [phase, setPhase] = useState(0); // 0: Start, 1: 2 balls, 2: 4 balls, 3: 6 balls (Done)
    const [fullResult, setFullResult] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInteractiveStep = async () => {
        if (isProcessing) return;
        setError(null);

        if (phase === 0) {
            // Step 1: Reveal first 3 numbers (Analyzed)
            setIsProcessing(true);
            setSpinningIndices([0, 1, 2, 3, 4, 5]);
            try {
                const res = await fetch('/api/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'interactive' }),
                });

                if (!res.ok) throw new Error("서버 오류가 발생했습니다.");

                const data = await res.json();
                if (!data.numbers || data.numbers.length < 6) throw new Error("올바르지 않은 번호 데이터입니다.");

                setFullResult(data.numbers);

                setTimeout(() => {
                    setNumbers(prev => {
                        const next = [...prev];
                        next[0] = data.numbers[0];
                        next[1] = data.numbers[1];
                        next[2] = data.numbers[2];
                        return next;
                    });
                    setSpinningIndices([3, 4, 5]);
                    setPhase(1);
                    setIsProcessing(false);
                }, 1500);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "추천 번호를 가져오는 데 실패했습니다.");
                setSpinningIndices([]);
                setIsProcessing(false);
            }
        } else if (phase === 1 && fullResult.length === 6) {
            // Step 2: Reveal 4th number (Random 1)
            setIsProcessing(true);
            setTimeout(() => {
                setNumbers(prev => {
                    const next = [...prev];
                    next[3] = fullResult[3];
                    return next;
                });
                setSpinningIndices([4, 5]);
                setPhase(2);
                setIsProcessing(false);
            }, 1000);
        } else if (phase === 2 && fullResult.length === 6) {
            // Step 3: Reveal 5th number (Random 2)
            setIsProcessing(true);
            setTimeout(() => {
                setNumbers(prev => {
                    const next = [...prev];
                    next[4] = fullResult[4];
                    return next;
                });
                setSpinningIndices([5]);
                setPhase(3);
                setIsProcessing(false);
            }, 1000);
        } else if (phase === 3 && fullResult.length === 6) {
            // Step 4: Reveal 6th number (Random 3 - Final)
            setIsProcessing(true);
            setTimeout(() => {
                setNumbers(prev => {
                    const next = [...prev];
                    next[5] = fullResult[5];
                    return next;
                });
                setSpinningIndices([]);
                setPhase(4);
                setIsProcessing(false);

                // Save to local history
                const saved = localStorage.getItem('local_lotto_history');
                const history = saved ? JSON.parse(saved) : [];
                const newItem = {
                    numbers: fullResult,
                    date: new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                };
                localStorage.setItem('local_lotto_history', JSON.stringify([newItem, ...history].slice(0, 10)));
            }, 1000);
        } else {
            // Reset
            setNumbers(Array(6).fill(0));
            setPhase(0);
            setFullResult([]);
            setSpinningIndices([]);
            setIsProcessing(false);
        }
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen pt-24 pb-12 px-6">
            <Navbar />

            <section className="max-w-4xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black mt-8">
                        당신의 <span className="gradient-text">행운</span>을 완성하세요
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                        4번의 클릭으로 번호를 완성하세요.<br />
                        분석된 번호 3개가 먼저 나오고, 나머지는 하나씩 공개됩니다.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm italic">
                        {error}
                    </div>
                )}

                <div className="glass-morphism rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

                    <LottoSlot numbers={numbers} spinningIndices={spinningIndices} />

                    <div className="mt-8">
                        <button
                            onClick={handleInteractiveStep}
                            disabled={isProcessing}
                            className="flex items-center justify-center gap-2 mx-auto bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-primary shadow-2xl min-w-[300px]"
                        >
                            <Dices size={24} />
                            {phase === 0 ? "행운 번호 생성 시작" :
                                phase === 1 ? "나의 행운의 숫자 뽑기 (2/4)" :
                                    phase === 2 ? "나의 행운의 숫자 뽑기 (3/4)" :
                                        phase === 3 ? "마지막 행운 열기 (4/4)" :
                                            "다시 새로운 번호 뽑기"}
                        </button>
                    </div>
                </div>

                {/* Recent Luck (Local History) */}
                <div className="grid md:grid-cols-3 gap-6 mt-16">
                    <div className="glass-morphism p-6 rounded-2xl text-left space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Sparkles className="text-primary" size={24} />
                        </div>
                        <h3 className="text-xl font-bold">행운의 슬롯</h3>
                        <p className="text-muted-foreground text-sm">짜릿한 애니메이션과 함께 번호를 뽑는 즐거움을 느껴보세요.</p>
                    </div>
                    <div className="glass-morphism p-6 rounded-2xl text-left space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                            <TrendingUp className="text-secondary" size={24} />
                        </div>
                        <h3 className="text-xl font-bold">정밀한 통계</h3>
                        <p className="text-muted-foreground text-sm">과거 100회차 이상의 데이터를 바탕으로 확률을 분석합니다.</p>
                    </div>
                    {/* Simplified Clover/History display */}
                    <div className="glass-morphism p-6 rounded-2xl text-left space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Clover className="text-amber-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold">마이 히스토리</h3>
                        <p className="text-muted-foreground text-sm">로그인하면 장기적인 데이터를 안전하게 보관할 수 있습니다.</p>
                    </div>
                </div>

                <LocalRecentLuck key={fullResult.join(',')} />
            </section>
        </main>
    );
}

function LocalRecentLuck() {
    const [recent, setRecent] = useState<{ numbers: number[], date: string }[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('local_lotto_history');
        if (saved) {
            try {
                setRecent(JSON.parse(saved).slice(0, 3));
            } catch (e) {
                console.error("Failed to parse local history", e);
            }
        }
    }, []);

    if (recent.length === 0) return null;

    return (
        <div className="mt-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                최근 나의 행운 <span className="text-primary text-sm font-normal opacity-70">(기기 저장)</span>
            </h2>
            <div className="flex flex-col gap-3 max-w-xl mx-auto">
                {recent.map((item, idx) => (
                    <div key={idx} className="glass-morphism p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex gap-2">
                            {item.numbers.map((n, i) => (
                                <span key={i} className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                                    n <= 10 ? "bg-amber-400/20 text-amber-400" :
                                        n <= 20 ? "bg-blue-400/20 text-blue-400" :
                                            n <= 30 ? "bg-red-400/20 text-red-400" :
                                                n <= 40 ? "bg-gray-400/20 text-gray-400" :
                                                    "bg-green-400/20 text-green-400"
                                )}>
                                    {n}
                                </span>
                            ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground opacity-50 uppercase">{item.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Clover({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M7 11c-1.12 0-2 .88-2 2s.88 2 2 2 2-.88 2-2-.88-2-2-2Z" />
            <path d="M17 11c-1.12 0-2 .88-2 2s.88 2 2 2 2-.88 2-2-.88-2-2-2Z" />
            <path d="M12 7c-1.12 0-2 .88-2 2s.88 2 2 2 2-.88 2-2-.88-2-2-2Z" />
            <path d="M12 15c-1.12 0-2 .88-2 2s.88 2 2 2 2-.88 2-2-.88-2-2-2Z" />
            <path d="M12 12c-1.66 0-3 1.34-3 3S10.34 18 12 18s3-1.34 3-3-1.34-3-3-3Z" />
            <path d="M12 21v-3" />
        </svg>
    );
}
