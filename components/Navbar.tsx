import Link from 'next/link';
import { Clover } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism h-16 flex items-center px-6 md:px-12 justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold gradient-text">
                <Clover className="text-primary" />
                <span>LottoLuck</span>
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">홈</Link>
                <Link href="/stats" className="hover:text-primary transition-colors">통계</Link>
                <Link href="/history" className="hover:text-primary transition-colors">히스토리</Link>
            </div>

            <div className="hidden md:block">
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg glow-primary">
                    로그인
                </button>
            </div>
        </nav>
    );
}
