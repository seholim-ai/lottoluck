'use client';

import Navbar from '@/components/Navbar';
import { History, Heart } from 'lucide-react';

export default function HistoryPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6">
            <Navbar />

            <div className="max-w-4xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl font-black gradient-text">나의 행운 히스토리</h1>
                    <p className="text-muted-foreground">내가 생성하고 즐겨찾기한 번호들을 한눈에 확인하세요.</p>
                </header>

                <div className="glass-morphism rounded-3xl p-12 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                        <History className="text-muted-foreground" size={32} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">아직 저장된 번호가 없습니다</h2>
                        <p className="text-muted-foreground">로그인 후 번호를 생성하면 여기에 자동으로 저장됩니다.</p>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold transition-all glow-primary">
                        지금 번호 생성하러 가기
                    </button>
                </div>
            </div>
        </main>
    );
}
